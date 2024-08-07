from celery import shared_task
from pydub import AudioSegment
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import PronunciationAssessmentResult, StudySentences, StudySentenceByWord
from .pronunciation_assessment import pronunciation_assessment_continuous_from_file
import os
User = get_user_model()
from .models import StudySentencesCourseAssignment, PronunciationAssessmentResult
from .utils import create_user_report_pdf
from django.core.mail import send_mail
from django.utils.html import strip_tags


import logging
logger = logging.getLogger(__name__)

def retrieve_study_sentence_by_id(sentence_id):
    try:
        study_sentence = StudySentences.objects.get(id=sentence_id).sentence
        return study_sentence
    except StudySentences.DoesNotExist:
        return None


@shared_task()
def async_pronunciation_assessment(filename, sentence_id, language, user_id, delete_after_analysis=True):
    logger.warn(f"Starting pronunciation assessment for {filename} with sentence_id {sentence_id} and language {language} 1")
    reference_text = retrieve_study_sentence_by_id(sentence_id)
    if reference_text is None:
        return None
    
    if language == 1:
        human_readable_language = "en-US"
    elif language == 2:
        human_readable_language = "fr-FR"
    logger.warn(f"Starting pronunciation assessment for {filename} with sentence_id {sentence_id} and language {language}")
    result, word_offset_duration, phoneme_dicts, json_response = pronunciation_assessment_continuous_from_file(filename, reference_text, human_readable_language)
    if not json_response:
        json_response = ["No response from the API"]
        logger.warn("No response from the API")

    if not result:
        return ["No result from the API"]
        
    user = User.objects.get(id=user_id) if user_id is not None else None

    try:
        PronunciationAssessmentResult.objects.create(
            user=user,
            accuracy=result["Paragraph"]["accuracy_score"],
            completeness=result["Paragraph"]["completeness_score"],
            fluency=result["Paragraph"]["fluency_score"],
            sentence=StudySentences.objects.get(id=sentence_id),
            recognized_sentence=" ".join(result["RecognizedWords"]),
            language=language,
            json_response=json_response,
            json_result=result,
        )
    except:  # the API format has likely changed
        PronunciationAssessmentResult.objects.create(
            user=user,
            language=language,
            json_response=json_response,
            json_result=result,
        )

    if result and result["Words"]:
        logger.warn("Creating StudySentenceByWord objects")
        study_sentence_by_word_objects = [] 

        for word in result["Words"]:
            logger.warn(f"Word: {word}")
            if word["error_type"] in ["None", "Mispronunciation"]:
                logger.warn(f"Creating StudySentenceByWord object for {word['index']}")
                study_sentence_by_word_objects.append(
                    StudySentenceByWord(
                        course=user.belongs_to_course,
                        user=user,
                        sentence=StudySentences.objects.get(id=sentence_id),
                        word_index=word["index"],
                        accuracy_score=int(word["accuracy_score"]),
                    )
                )

    # batch insert
    if study_sentence_by_word_objects:
        StudySentenceByWord.objects.bulk_create(study_sentence_by_word_objects)
        logger.warn(f"Batch created {len(study_sentence_by_word_objects)} StudySentenceByWord objects")

    """
    if user is not None:
        for phoneme_dict in phoneme_dicts:
            phoneme_result, created = PhonemeAssessmentResult.objects.get_or_create(
                user=user, 
                phoneme_id=phoneme_dict["phoneme_id"], 
                language=language,
                defaults={"how_many_times": 1, "score": phoneme_dict["score"]}
            )
            
            if not created:
                phoneme_result.how_many_times += 1
                phoneme_result.score = (phoneme_dict["score"] + phoneme_result.score * phoneme_result.how_many_times) / (phoneme_result.how_many_times + 1)
                phoneme_result.save()

    """
    if delete_after_analysis:
        if os.path.exists(filename):
            os.remove(filename)

    logger.warn(f"Finished pronunciation assessment for {filename} with sentence_id {sentence_id} and language {language}")


    return result, word_offset_duration


@shared_task()
def async_user_report_creation(user_id):
    user = User.objects.get(id=user_id)
    user_data = {"sentences": [], "language": user.language}

    # fetch all location values for the course
    course = user.belongs_to_course
    
    # fetch all sentences for the course
    sentences_assignements = StudySentencesCourseAssignment.objects.filter(course=course)

    sentence_counter = 1
    for sentence_assignment in sentences_assignements:
        sentence_data = []

        sentence_id = sentence_assignment.sentence.id
        sentence_text = sentence_assignment.sentence.sentence
        
        # fetch all the pronunciation assessment results for the sentence for the user
        pronunciation_results = PronunciationAssessmentResult.objects.filter(sentence=sentence_id, user=user, completeness__gt=25)
        total_accuracy = 0
        count = 0
        if pronunciation_results:
            for pronunciation_result in pronunciation_results:
                data = pronunciation_result.json_response
                words_data = data.get("NBest", [])[0].get("Words", [])

                # Create a list of tuples (word, score, error_type)
                word_score_list = [(entry["Word"], entry["PronunciationAssessment"]["AccuracyScore"], entry["PronunciationAssessment"]["ErrorType"]) for entry in words_data]
                sentence_data.append(word_score_list)
                count += 1
                total_accuracy += pronunciation_result.accuracy
        user_data["sentences"].append({"sentence_counter": sentence_counter, "sentence_text": sentence_text, "words": sentence_data, "accuracy": total_accuracy/count if count > 0 else None})
        sentence_counter += 1
    
    presigned_url = create_user_report_pdf(user_data)

    subject = 'Dein AusspracheTrainer Studienreport ist bereit'
    html_message = f'''
        Bitte lade Deinen AusspracheTrainer Studienreport <a href="{presigned_url}">hier</a> herunter.
        <br><br>
        Dieser Link ist für eine Woche gültig. Bitte speichere den Report auf Deinem Gerät, er wird nach einer Woche unwiderruflich von den Servern gelöscht.
    '''
    plain_message = strip_tags(html_message)
    from_email = settings.EMAIL_HOST_USER
    to = [user.email]

    send_mail(
        subject,
        plain_message,
        from_email,
        to,
        fail_silently=True,
        html_message=html_message
    )
    

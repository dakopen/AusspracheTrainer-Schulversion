from celery import shared_task
from pydub import AudioSegment
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import PronunciationAssessmentResult, StudySentences
from .pronunciation_assessment import pronunciation_assessment_continuous_from_file

User = get_user_model()

def retrieve_study_sentence_by_id(sentence_id):
    try:
        study_sentence = StudySentences.objects.get(id=sentence_id).sentence
        return study_sentence
    except StudySentences.DoesNotExist:
        return None


@shared_task()
def async_pronunciation_assessment(filename, sentence_id, language, user_id):
    reference_text = retrieve_study_sentence_by_id(sentence_id)
    if reference_text is None:
        return None
    
    if language == 1:
        human_readable_language = "en-US"
    elif language == 2:
        human_readable_language = "fr-FR"

    result, word_offset_duration, phoneme_dicts, json_response = pronunciation_assessment_continuous_from_file(filename, reference_text, human_readable_language)

    json_response = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]  

    
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
            full_result=json_response,
        )
    except:  # the API format has likely changed
        PronunciationAssessmentResult.objects.create(
            user=user,
            language=language,
            full_result=json_response,
        )


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

    return result, word_offset_duration
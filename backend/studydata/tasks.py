from celery import shared_task
from pydub import AudioSegment
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import PronunciationAssessmentResult, StudySentences


def retrieve_study_sentence_by_id(sentence_id):
    try:
        study_sentence = StudySentences.objects.get(id=sentence_id)
        return study_sentence
    except StudySentences.DoesNotExist:
        return None


@shared_task
def async_pronunciation_assessment(file_name, text, language, user_id=None):
    # Logic for processing the audio file
    # For example, transcribing or analyzing pronunciation
    print(f"Processing file: {file_name}, Text: {text}, Language: {language}, User ID: {user_id}")
    # Place the actual processing logic here


@shared_task()
def async_pronunciation_assessment2(filename, sentence_id, language, user):
    reference_text = retrieve_study_sentence_by_id(sentence_id)
    if reference_text is None:
        return None
    
    result, word_offset_duration, phoneme_dicts = pronunciation_assessment_continuous_from_file(filename, reference_text, language)


    PronunciationAssessmentResult.objects.create(
        user=user,
        accuracy=result["Paragraph"]["accuracy_score"],
        completeness=result["Paragraph"]["completeness_score"],
        fluency=result["Paragraph"]["fluency_score"],
        sentence=reference_text,
        recognized_sentence=" ".join(result["RecognizedWords"]),
        language=language
    )

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



    return result, word_offset_duration
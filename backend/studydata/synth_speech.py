import azure.cognitiveservices.speech as speechsdk
from django.core.files.base import ContentFile
from backend.settings import MS_SPEECH_SERVICES_API_KEY as speech_key
from backend.settings import MS_SPEECH_SERVICES_REGION as service_region
import uuid
import datetime
from django.conf import settings
import logging
from django.utils import timezone
from .models import StudySentences
from django.core.files.storage import get_storage_class
from backend.custom_storages import SynthStorage

logger = logging.getLogger(__name__)

speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)

speech_config.speech_synthesis_voice_name = "en-GB-RyanNeural"
speech_synthesizer_english = speechsdk.SpeechSynthesizer(speech_config=speech_config)

speech_config.speech_synthesis_voice_name = "fr-FR-DeniseNeural"
speech_synthesizer_french = speechsdk.SpeechSynthesizer(speech_config=speech_config)

def synthesize_speech(studysentence_id, text=None, language=None):

    synth_storage = SynthStorage()

    logger.warn("starting synthesize_speech")
    # check if the studysentence object already has a synth_filename
    studysentence = StudySentences.objects.get(id=studysentence_id)

    if text is None:
        text = studysentence.sentence
    if language is None:
        language = studysentence.language


    if language == 1:
        speech_synthesizer = speech_synthesizer_english
    elif language == 2:
        speech_synthesizer = speech_synthesizer_french
    
    
    # Synthesizing the given text
    result = speech_synthesizer.speak_text_async(text).get()

    filename = f'{uuid.uuid4()}.wav'
    logger.warn(f"Saving file {filename}")

    # Check if the synthesis was successful
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:

        path = synth_storage.save(filename, ContentFile(result.audio_data))
        logger.warn("file saved")
        return synth_storage.url(path)
    
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print(f"Speech synthesis canceled: {cancellation_details.reason}")
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print(f"Error details: {cancellation_details.error_details}")
    
        return None
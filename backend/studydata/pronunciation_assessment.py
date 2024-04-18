import time
import json
import difflib
import azure.cognitiveservices.speech as speechsdk
import string
import os
from backend.settings import MS_SPEECH_SERVICES_API_KEY as speech_key
from backend.settings import MS_SPEECH_SERVICES_REGION as service_region
import logging

logger = logging.getLogger(__name__)
# from analyze.phoneme_analysis import get_phoneme_index



speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)

def pronunciation_assessment_continuous_from_file(filename, reference_text, language):
    """Performs continuous pronunciation assessment asynchronously with input from an audio file.
        See more information at https://aka.ms/csspeech/pa"""
    audio_config = speechsdk.audio.AudioConfig(filename=filename)
    
    enable_miscue = True
    # create pronunciation assessment config, set grading system, granularity and if enable miscue based on your requirement.
    pronunciation_config = speechsdk.PronunciationAssessmentConfig(
        reference_text=reference_text,
        grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
        granularity=speechsdk.PronunciationAssessmentGranularity.Phoneme,
        enable_miscue=enable_miscue)

    # Creates a speech recognizer using a file as audio input.
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, language=language, audio_config=audio_config)
    # apply pronunciation assessment config to speech recognizer
    pronunciation_config.apply_to(speech_recognizer)

    done = False
    recognized_words = []
    fluency_scores = []
    durations = []
    word_offset_duration = []
    phoneme_dicts = [] # contains {"phoneme_id": X, "score": Y}, ...
    jo = None

    logger.warn("Starting continuous pronunciation assessment from file")

    def stop_cb(evt: speechsdk.SessionEventArgs):
        """callback that signals to stop continuous recognition upon receiving an event `evt`"""
        nonlocal done
        done = True

    def recognized(evt: speechsdk.SpeechRecognitionEventArgs):
        pronunciation_result = speechsdk.PronunciationAssessmentResult(evt.result)

        nonlocal recognized_words, fluency_scores, durations, word_offset_duration, phoneme_dicts, jo
        recognized_words += pronunciation_result.words
        fluency_scores.append(pronunciation_result.fluency_score)
        json_result = evt.result.properties.get(speechsdk.PropertyId.SpeechServiceResponse_JsonResult)
        jo = json.loads(json_result)
        nb = jo['NBest'][0]
        durations.append(sum([int(w['Duration']) for w in nb['Words']]))
        
        """
        for word in nb['Words']:
            word_offset_duration.append((word['Offset']/10000, word['Duration']/10000, word['PronunciationAssessment']['AccuracyScore'], word['Word']))


            # Store all phoneme scores:
            for phoneme in word["Phonemes"]:
                if phoneme["Phoneme"] != "":
                    phoneme_dicts.append({"phoneme_id": get_phoneme_index(phoneme["Phoneme"], language), "score": phoneme['PronunciationAssessment']['AccuracyScore']})
        """
            


    # Connect callbacks to the events fired by the speech recognizer
    speech_recognizer.recognized.connect(recognized)
    # speech_recognizer.session_started.connect(lambda evt: print('SESSION STARTED: {}'.format(evt)))
    # speech_recognizer.session_stopped.connect(lambda evt: print('SESSION STOPPED {}'.format(evt)))
    # speech_recognizer.canceled.connect(lambda evt: print('CANCELED {}'.format(evt)))

    # stop continuous recognition on either session stopped or canceled events
    speech_recognizer.session_stopped.connect(stop_cb)
    speech_recognizer.canceled.connect(stop_cb)

    # Start continuous pronunciation assessment
    speech_recognizer.start_continuous_recognition()
    while not done:
        time.sleep(.5)
    
    speech_recognizer.stop_continuous_recognition()

    # we need to convert the reference text to lower case, and split to words, then remove the punctuations.
    
    reference_words = [w.strip(string.punctuation) for w in reference_text.lower().split()]

    # For continuous pronunciation assessment mode, the service won't return the words with `Insertion` or `Omission`
    # even if miscue is enabled.
    # We need to compare with the reference text after received all recognized words to get these error words.

    if enable_miscue:
        diff = difflib.SequenceMatcher(None, reference_words, [x.word.lower() for x in recognized_words])
        final_words = []
        for tag, i1, i2, j1, j2 in diff.get_opcodes():
            if tag in ['insert', 'replace']:
                for word in recognized_words[j1:j2]:
                    if word.error_type == 'None':
                        word._error_type = 'Insertion'
                    final_words.append(word)
            if tag in ['delete', 'replace']:
                for word_text in reference_words[i1:i2]:
                    word = speechsdk.PronunciationAssessmentWordResult({
                        'Word': word_text,
                        'PronunciationAssessment': {
                            'ErrorType': 'Omission',
                        }
                    })
                    final_words.append(word)
            if tag == 'equal':
                final_words += recognized_words[j1:j2]
    else:
        final_words = recognized_words

    # We can calculate whole accuracy by averaging
    final_accuracy_scores = []
    for word in final_words:
        if word.error_type == 'Insertion':
            continue
        else:
            final_accuracy_scores.append(word.accuracy_score)
    
    if len(final_accuracy_scores) > 0:
        accuracy_score = sum(final_accuracy_scores) / len(final_accuracy_scores)
    else:
        accuracy_score = 0    
    
    # Re-calculate fluency score
    if sum(durations) > 0:
        fluency_score = sum([x * y for (x, y) in zip(fluency_scores, durations)]) / sum(durations)
    else:
        fluency_score = 0    # Calculate whole completeness score
    completeness_score = len([w for w in recognized_words if w.error_type == "None"]) / len(reference_words) * 100
    completeness_score = completeness_score if completeness_score <= 100 else 100

    results = {
        'Paragraph': {
            'accuracy_score': accuracy_score,
            'completeness_score': completeness_score,
            'fluency_score': fluency_score,
        },
        'Words': [],
        'RecognizedWords': [x.word for x in recognized_words]
    }

    for idx, word in enumerate(final_words):
        word_info = {
            'index': idx + 1,
            'word': word.word,
            'accuracy_score': word.accuracy_score,
            'error_type': word.error_type
        }
        results['Words'].append(word_info)


    return results, word_offset_duration, phoneme_dicts, jo
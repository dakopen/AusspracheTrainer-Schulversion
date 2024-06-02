from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from .models import StudySentences, StudySentencesCourseAssignment, TestSentencesWithAudio
from .synth_speech import synthesize_speech
from accounts.models import Course
import random
import os

@receiver(pre_save, sender=StudySentences)
def create_synth_speech(sender, instance, **kwargs):
    # Prevent recursion by checking if we are already processing
    if hasattr(instance, '_processing'):
        return
    setattr(instance, '_processing', True)

    try:
        if instance.id is not None:
            # Instance is being updated
            old_instance = StudySentences.objects.get(id=instance.id)
            if instance.sentence != old_instance.sentence or instance.language != old_instance.language:
                instance.synth_filename = synthesize_speech(instance.id, text=instance.sentence, language=instance.language)
                instance.save(update_fields=["synth_filename"])

    finally:
        delattr(instance, '_processing')


@receiver(post_save, sender=StudySentences)
def create_synth_speech(sender, instance, created, **kwargs):
    if created:
        instance.synth_filename = synthesize_speech(instance.id, text=instance.sentence, language=instance.language)
        instance.save(update_fields=["synth_filename"])


@receiver(post_save, sender=Course)
def assign_sentences(sender, instance, created, **kwargs):
    NUM_SENTENCES_TEST = 20
    NUM_SENTENCES_PER_WEEK = 10
    NUM_WEEKS = 6

    # get the language of the course
    language = instance.language

    if created:
        i = 1

        test_sentences = StudySentences.objects.filter(language=language).order_by('number_of_times_assigned_as_test', 'number_of_times_assigned_as_train')[: NUM_SENTENCES_TEST]
        random.shuffle(list(test_sentences))
        for sentence in test_sentences:
            sentence.number_of_times_assigned_as_test += 1
            sentence.save()
            StudySentencesCourseAssignment.objects.create(course=instance, sentence=sentence, location_value=i)
            i += 1
        
        final_test_sentences = StudySentences.objects.filter(language=language).exclude(id__in=[sentence.id for sentence in test_sentences]).order_by('number_of_times_assigned_as_test', 'number_of_times_assigned_as_train')[:NUM_SENTENCES_TEST]
        random.shuffle(list(final_test_sentences))    
        for sentence in final_test_sentences:
            sentence.number_of_times_assigned_as_test += 1
            sentence.save()
            StudySentencesCourseAssignment.objects.create(course=instance, sentence=sentence, location_value=i)
            i += 1


        # filter out test sentences from test sentences
        train_sentences = StudySentences.objects.filter(language=language).exclude(id__in=[sentence.id for sentence in test_sentences]).exclude(id__in=[sentence.id for sentence in final_test_sentences]).order_by('number_of_times_assigned_as_train', 'number_of_times_assigned_as_test')[:NUM_SENTENCES_PER_WEEK * NUM_WEEKS]
        random.shuffle(list(train_sentences))
        for sentence in train_sentences:
            sentence.number_of_times_assigned_as_train += 1
            sentence.save()
            StudySentencesCourseAssignment.objects.create(course=instance, sentence=sentence, location_value=i)
            i += 1

        # add 4 tutorial sentences
        tutorial_sentences = StudySentences.objects.filter(language=language).exclude(id__in=[sentence.id for sentence in test_sentences]).exclude(id__in=[sentence.id for sentence in final_test_sentences]).exclude(id__in=[sentence.id for sentence in train_sentences])[:4]
        for sentence in tutorial_sentences:
            StudySentencesCourseAssignment.objects.create(course=instance, sentence=sentence, location_value=i)
            i += 1
        

@receiver(post_delete, sender=TestSentencesWithAudio)
def delete_audio_file(sender, instance, **kwargs):
    if instance.audio_file_path and os.path.exists(instance.audio_file_path):
        os.remove(instance.audio_file_path)

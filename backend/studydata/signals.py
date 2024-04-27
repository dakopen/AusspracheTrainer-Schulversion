from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import StudySentences, StudySentencesCourseAssignment
from .synth_speech import synthesize_speech
from accounts.models import Course
import random

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


@receiver(post_save, sender=Course)
def assign_sentences(sender, instance, created, **kwargs):
    NUM_SENTENCES_TEST = 20
    NUM_SENTENCES_PER_WEEK = 10
    NUM_WEEKS = 6

    if created:
        test_sentences = StudySentences.objects.order_by('number_of_times_assigned_as_test', 'number_of_times_assigned_as_train')[: NUM_SENTENCES_TEST]

        # filter out test sentences from test sentences
        train_sentences = StudySentences.objects.exclude(id__in=[sentence.id for sentence in test_sentences]).order_by('number_of_times_assigned_as_train', 'number_of_times_assigned_as_test')[:NUM_SENTENCES_PER_WEEK * NUM_WEEKS]
        
        i = 1
        
        for sentence in test_sentences:
            sentence.number_of_times_assigned_as_test += 1
            sentence.save()
            StudySentencesCourseAssignment.objects.create(course=instance, sentence=sentence, location_value=i)
            i += 1

        for sentence in train_sentences:
            sentence.number_of_times_assigned_as_train += 1
            sentence.save()
            StudySentencesCourseAssignment.objects.create(course=instance, sentence=sentence, location_value=i)
            i += 1
        

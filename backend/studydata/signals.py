from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import StudySentences
from .synth_speech import synthesize_speech

@receiver(pre_save, sender=StudySentences)
def create_synth_speech(sender, instance, created, **kwargs):
    # Check if it has been updated
    if not created:
        old_instance = StudySentences.objects.get(id=instance.id)
        
        # Check if 'sentence' or 'language' fields have changed
        if instance.sentence != old_instance.sentence or instance.language != old_instance.language:
            instance.synth_filename = synthesize_speech(instance.id)
            instance.save(update_fields=["synth_filename"])



@receiver(post_save, sender=StudySentences)
def create_synth_speech(sender, instance, created, **kwargs):
    # Check if instance is newly created
    if created:
        instance.synth_filename = synthesize_speech(instance.id)
        instance.save(update_fields=["synth_filename"])

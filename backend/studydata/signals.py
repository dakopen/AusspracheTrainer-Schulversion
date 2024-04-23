from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import StudySentences
from .synth_speech import synthesize_speech


@receiver(post_save, sender=StudySentences)
def create_synth_speech(sender, instance, created, **kwargs):
    if created and not instance.synth_filename:

        instance.synth_filename = synthesize_speech(instance.id)
        instance.save()


from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import StudySentences

@receiver(post_save, sender=StudySentences)
def create_synth_speech(sender, instance, created, **kwargs):
    if created and not instance.synth_filename:
        # Code to generate synthesized speech and save the path
        instance.synth_filename = 'file.wav'
        instance.save()


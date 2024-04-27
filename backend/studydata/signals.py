from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import StudySentences
from .synth_speech import synthesize_speech

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
    # Check if instance is newly created
    if created:
        instance.synth_filename = synthesize_speech(instance.id)
        instance.save(update_fields=["synth_filename"])

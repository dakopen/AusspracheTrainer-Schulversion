from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import StudySentences
from .synth_speech import synthesize_speech


@receiver(post_save, sender=StudySentences)
def create_synth_speech(sender, instance, created, **kwargs):
    if created:
        instance.synth_filename = synthesize_speech(instance.id)
        instance.save(update_fields=["synth_filename"])

    # TODO: rerun the synth on edit
    # DOES NOT WORK, NEEDS SOMETHING MORE SOPHISTICATED
    # https://chat.openai.com/c/39d8258b-912a-4e5e-908e-ffe79b6373e7
    else:
        # Fetch the instance from the database before it was saved
        old_instance = StudySentences.objects.get(id=instance.id)
        
        # Check if 'sentence' or 'language' fields have changed
        if instance.sentence != old_instance.sentence or instance.language != old_instance.language:
            instance.synth_filename = synthesize_speech(instance.id)
            instance.save(update_fields=["synth_filename"])

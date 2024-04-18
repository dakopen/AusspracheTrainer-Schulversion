from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

ENGLISH = 1
FRENCH = 2

LANGUAGE_CHOICES = (
    (ENGLISH, 'English'),
    (FRENCH, 'French'),
)

class FirstQuestionnaire(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(auto_now_add=True)
    age = models.PositiveSmallIntegerField(validators=[MaxValueValidator(99)], null=True, blank=True)
    sex = models.CharField(
        max_length=1, 
        choices=[
            ('m', 'Male'),
            ('w', 'Female'),
            ('d', 'Diverse')
        ], null=True, blank=True
    )
    pronunciation_skill = models.IntegerField(choices=[(i, i) for i in range(1, 11)], null=True, blank=True)  # Scale of 1 to 10
    weekly_language_contact_hours = models.PositiveSmallIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Questionnaire Submission"

class PronunciationAssessmentResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(auto_now_add=True)
    
    sentence_id = models.IntegerField()
    recognized_sentence = models.TextField(null=True, blank=True)
    

    language = models.PositiveSmallIntegerField(choices=LANGUAGE_CHOICES)

    accuracy = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], null=True, blank=True)
    completeness = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], null=True, blank=True)
    fluency = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], null=True, blank=True)

    full_result = models.JSONField()

    def __str__(self):
        return f"Pronunciation Assessment Result for {self.user.username} on {self.date_submitted}"
    


class StudySentences(models.Model):
    sentence = models.TextField(unique=True)
    language = models.PositiveSmallIntegerField(choices=LANGUAGE_CHOICES)
    synth_filename = models.CharField(default=None, null=True, blank=True, max_length=255)
    number_of_times_assigned = models.PositiveIntegerField(default=0)
    number_of_times_completed = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Study Sentence in {self.get_language_display()}, with id {self.id}"

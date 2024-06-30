from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from backend.custom_storages import PrivateMediaStorage
import os

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
    
class FinalQuestionnaire(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(auto_now_add=True)
    motivation = models.IntegerField(choices=[(i, i) for i in range(1, 11)], null=True, blank=True)  # Scale of 1 to 10
    weekly_training_in_minutes = models.PositiveSmallIntegerField(null=True, blank=True)
    feeling_of_improvement = models.IntegerField(choices=[(i, i) for i in range(1, 11)], null=True, blank=True)  # Scale of 1 to 10
    
    def __str__(self):
        return f"{self.user.username}'s Final Questionnaire Submission"

class PronunciationAssessmentResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(auto_now_add=True)
    
    sentence = models.ForeignKey('StudySentences', on_delete=models.SET_NULL, null=True, blank=True)
    recognized_sentence = models.TextField(null=True, blank=True)
    

    language = models.PositiveSmallIntegerField(choices=LANGUAGE_CHOICES)

    accuracy = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], null=True, blank=True)
    completeness = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], null=True, blank=True)
    fluency = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)], null=True, blank=True)

    json_response = models.JSONField()

    json_result = models.JSONField()

    def __str__(self):
        return f"Pronunciation Assessment Result for {self.user.username} on {self.date_submitted}"
    
class TestSentencesWithAudio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence = models.ForeignKey('StudySentences', on_delete=models.CASCADE)
    audio_file_path = models.CharField(max_length=255)
    deleted = models.BooleanField(default=False)


class StudySentences(models.Model):
    sentence = models.TextField(unique=True)
    language = models.PositiveSmallIntegerField(choices=LANGUAGE_CHOICES)
    synth_filename = models.CharField(default=None, null=True, blank=True, max_length=255)
    number_of_times_assigned_as_test = models.PositiveIntegerField(default=0)
    number_of_times_assigned_as_train = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Study Sentence in {self.get_language_display()}, with id {self.id}"

class StudySentencesCourseAssignment(models.Model):
    course = models.ForeignKey('accounts.Course', on_delete=models.CASCADE)
    sentence = models.ForeignKey('StudySentences', on_delete=models.CASCADE)
    location_value = models.PositiveSmallIntegerField(default=0)  # 1 - 20 are test sentences, then 21-30 are for week 1, 31-40 for week 2, etc.

    def __str__(self):
        return f"Assignment of Sentence {self.sentence.id} to Course {self.course.id}"
    

class StudySentenceByWord(models.Model):
    course = models.ForeignKey('accounts.Course', on_delete=models.CASCADE, null=True, blank=True)
    word_index = models.PositiveSmallIntegerField()
    sentence = models.ForeignKey('StudySentences', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accuracy_score = models.PositiveBigIntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])

    def __str__(self):
        return f"Study Sentence by Word for {self.user.username} on {self.sentence.sentence} at index {self.word_index}"
    

class SynthSpeechLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence = models.ForeignKey('StudySentences', on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
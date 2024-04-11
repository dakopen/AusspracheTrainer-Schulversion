from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

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


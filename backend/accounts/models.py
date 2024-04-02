from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    short_id = models.CharField(max_length=10, unique=True, validators=[RegexValidator(r'^[A-Z]+$')])

class User(AbstractUser):
    STUDENT = 1
    TEACHER = 2
    SECRETARY = 3
    STUDYSTUDENT = 4
    ROLE_CHOICES = (
        (STUDENT, 'Student'),
        (TEACHER, 'Teacher'),
        (SECRETARY, 'Secretary'),
        (STUDYSTUDENT, 'Study Student'),
    )
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, blank=True, null=True)
    school = models.ForeignKey('School', on_delete=models.CASCADE, blank=True, null=True, related_name='users')


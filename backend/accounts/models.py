from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator, EmailValidator
from django.core.exceptions import ValidationError


class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    short_id = models.CharField(max_length=10, unique=True, validators=[RegexValidator(r'^[A-Z]+$')])
    english_since_grade = models.PositiveSmallIntegerField(default=5)
    french_since_grade = models.PositiveSmallIntegerField(default=6)

class Course(models.Model):
    name = models.CharField(max_length=255)
    ENGLISH = 1
    FRENCH = 2

    LANGUAGE_CHOICES = (
        (ENGLISH, 'English'),
        (FRENCH, 'French'),
    )
    grade = models.PositiveSmallIntegerField(default=5)
    language = models.PositiveSmallIntegerField(choices=LANGUAGE_CHOICES, default=ENGLISH)
    teacher = models.ForeignKey('User', on_delete=models.PROTECT, related_name='courses')

    start_date = models.DateField(default=None, null=True, blank=True)
    study_started = models.BooleanField(default=False)
    

class User(AbstractUser):
    TEACHER = DEFAULT = 1
    SECRETARY = 2
    ADMIN = 3
    STUDYSTUDENT = 10

    ROLE_CHOICES = (
        (TEACHER, 'Teacher'),
        (SECRETARY, 'Secretary'),
        (ADMIN, 'Admin'),
        (STUDYSTUDENT, 'Study Student'),
    )

    # Override the username field
    username = models.EmailField('E-Mail Adresse', unique=True, validators=[EmailValidator()])
    
    # keep duplicate email field for compatibility with AbstractUser
    email = models.EmailField('E-Mail Adresse', unique=False, validators=[EmailValidator()], blank=True, null=True)

    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=ADMIN)
    school = models.ForeignKey('School', on_delete=models.PROTECT, blank=True, null=True, related_name='users')

    belongs_to_course = models.ForeignKey('Course', on_delete=models.PROTECT, null=True, blank=True, related_name='students')

    language = models.PositiveSmallIntegerField(choices=Course.LANGUAGE_CHOICES, null=True, blank=True)
    full_access_group = models.BooleanField(default=True, null=True, blank=True)

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = []


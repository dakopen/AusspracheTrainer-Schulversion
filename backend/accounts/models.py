from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator, EmailValidator
from django.core.exceptions import ValidationError


class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    short_id = models.CharField(max_length=10, unique=True, validators=[RegexValidator(r'^[A-Z]+$')])

class Course(models.Model):
    name = models.CharField(max_length=255)
    ENGLISH = 1
    FRENCH = 2

    LANGUAGE_CHOICES = (
        (ENGLISH, 'English'),
        (FRENCH, 'French'),
    )

    language = models.PositiveSmallIntegerField(choices=LANGUAGE_CHOICES, default=ENGLISH)
    teacher = models.ForeignKey('User', on_delete=models.CASCADE, related_name='courses')


    def clean(self):
        if not self.teacher.role == User.TEACHER:
            raise ValidationError("Only teachers create courses.")

class User(AbstractUser):
    is_token_user = models.BooleanField(default=False)

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
    school = models.ForeignKey('School', on_delete=models.CASCADE, blank=True, null=True, related_name='users')

    study_student_username = models.CharField(max_length=10, unique=True, null=True, blank=True)
    belongs_to_course = models.ForeignKey('Course', on_delete=models.SET_NULL, null=True, blank=True, related_name='students')

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = []


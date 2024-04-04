from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator, EmailValidator

class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    short_id = models.CharField(max_length=10, unique=True, validators=[RegexValidator(r'^[A-Z]+$')])

class User(AbstractUser):
    TEACHER = DEFAULT = 1
    SECRETARY = 2
    ADMIN = 3
    ROLE_CHOICES = (
        (TEACHER, 'Teacher'),
        (SECRETARY, 'Secretary'),
        (ADMIN, 'Admin'),
    )

    # Override the username field
    username = models.EmailField('E-Mail Adresse', unique=True, validators=[EmailValidator()])
    
    # keep duplicate email field for compatibility with AbstractUser
    email = models.EmailField('E-Mail Adresse', unique=False, validators=[EmailValidator()], blank=True, null=True)

    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=ADMIN)
    school = models.ForeignKey('School', on_delete=models.CASCADE, blank=True, null=True, related_name='users')

    USERNAME_FIELD = 'username'

    REQUIRED_FIELDS = []

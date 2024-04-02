from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    short_id = models.CharField(max_length=10, unique=True, validators=[RegexValidator(r'^[A-Z]+$')])

class User(AbstractUser):
    TEACHER = 1
    SECRETARY = 2
    ADMIN = 3
    ROLE_CHOICES = (
        (TEACHER, 'Teacher'),
        (SECRETARY, 'Secretary'),
        (ADMIN, 'Admin'),
    )
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=ADMIN)
    school = models.ForeignKey('School', on_delete=models.CASCADE, blank=True, null=True, related_name='users')


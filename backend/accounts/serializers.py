from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.core.validators import RegexValidator
from rest_framework import serializers

from .models import Course, School

import random
import string
import logging
logger = logging.getLogger(__name__)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'school', 'role', 'belongs_to_course')  # Adjusted to not include 'email'

    def create(self, validated_data, school=None, role=None):
        if role is None:
            role = validated_data.get('role', User.DEFAULT)
        
        if school is None:
            school = validated_data.get('school')
        
        role == validated_data.get('role', User.DEFAULT)
        if role == User.STUDYSTUDENT:
            username = self.generate_study_student_username()
            user = User.objects.create_user(
                username=f"{username}@studie.aussprachetrainer.org",
                school=school,
                password=username,
                role=role,
                belongs_to_course=validated_data.get('course')
            )
           
        else:
            user = User.objects.create_user(
                username=validated_data.get('username'),  # username is the email
                email=validated_data.get('username'),
                password=None,  # User is created without a password
                school=school,
                role=role,
            )
            self.send_password_setup_email(user)

        user.is_active = False

        user.save()
        return user
    
    def generate_study_student_username(self):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

    
    def send_password_setup_email(self, user):
        # Logic remains the same
        token, uid = self.generate_password_reset_token(user)
        password_reset_link = f"{settings.FRONTEND_URL}/set-password/?token={token}&uid={uid}"
        send_mail(
            'Aktiviere Deinen AusspracheTrainer Account',
            f'Bitte aktiviere Deinen Account, indem Du ein Passwort wählst: {password_reset_link}',
            settings.DEFAULT_FROM_EMAIL,
            [user.username],  # username is the email
            fail_silently=False,
        )
    
    def generate_password_reset_token(self, user):
        # Logic remains the same
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        return token, uid

class SchoolSerializer(serializers.ModelSerializer):
    short_id = serializers.CharField(
        max_length=10,
        validators=[RegexValidator(r'^[A-Z]+$')]
    )

    class Meta:
        model = School
        fields = ('id', 'name', 'address', 'short_id')


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'language', 'teacher')
        extra_kwargs = {'teacher': {'read_only': True}}

    def validate(self, attrs):
        teacher = self.context['request'].user
        if teacher.role != User.TEACHER:
            raise serializers.ValidationError("Only teachers can create courses.")
        return attrs

    def create(self, validated_data):
        return Course.objects.create(**validated_data)
 
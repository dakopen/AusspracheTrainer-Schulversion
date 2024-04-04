from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from django.core.validators import RegexValidator
from rest_framework import serializers

from .models import School


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'school')  # Adjusted to not include 'email'

    def create(self, validated_data, school=None, role=None):
        if school is None:
            school = validated_data.get('school')
        
        if role is None:
            role = validated_data.get('role')

        user = User.objects.create_user(
            username=validated_data['username'],  # username is the email
            password=None,  # User is created without a password
            school=school,
            role=role
        )
        user.is_active = False  # Make the user inactive until they set their password
        user.save()
        
        # Send the password setup link to the user's email
        self.send_password_setup_email(user)

        return user
    
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
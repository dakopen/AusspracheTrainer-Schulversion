from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework import serializers
from django.urls import reverse
from django.conf import settings

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'school')  # Adjusted to not include 'email'

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],  # username is the email
            password=None,  # User is created without a password
            email=None
        )
        user.school = validated_data.get('school', None)
        user.is_active = False  # Make the user inactive until they set their password
        user.save()
        
        # Send the password setup link to the user's email
        self.send_password_setup_email(user)

        return user
    
    def send_password_setup_email(self, user):
        # Logic remains the same
        token = self.generate_password_reset_token(user)
        password_reset_link = f"{settings.FRONTEND_URL}/set-password/?token={token}"
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
        return f"{uid}/{token}"

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.http import JsonResponse
from django.utils.http import urlsafe_base64_decode
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, views, generics
from rest_framework.views import APIView

from .serializers import UserSerializer
from .permissions import IsAdminOrSecretaryCreatingAllowedRoles

import logging
logger = logging.getLogger(__name__)


User = get_user_model()

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})



class CreateUserView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrSecretaryCreatingAllowedRoles]

    def perform_create(self, serializer):
        # If the creator is a secretary, set the school to their school
        if self.request.user.role == self.request.user.SECRETARY:
            serializer.save(school=self.request.user.school)
        else:
            serializer.save()


class SetPasswordView(APIView):
    def post(self, request, *args, **kwargs):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')
        logger.warn("uidb64: %s, token: %s, password: %s", uidb64, token, password)
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError):
            return Response({"error": "Invalid UID. Unable to decode UID."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User does not exist. Invalid UID."}, status=status.HTTP_404_NOT_FOUND)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid token or token has expired."}, status=status.HTTP_400_BAD_REQUEST)

        if password is None or password.strip() == "":
            return Response({"error": "Password cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Here you can add more conditions to check password complexity, length, etc.
        # if not is_valid_password(password):
        #     return Response({"error": "Password does not meet complexity requirements."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.is_active = True  # Optionally activate the user now
        user.save()
        return Response({"success": "Password has been set successfully."}, status=status.HTTP_200_OK)
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
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(password)
            user.is_active = True  # Optionally activate the user now
            user.save()
            return Response({"success": "Password has been set."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


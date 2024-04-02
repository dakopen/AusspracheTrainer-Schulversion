from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, views, generics
from .serializers import UserSerializer
from .permissions import IsAdminOrSecretaryCreatingAllowedRoles

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


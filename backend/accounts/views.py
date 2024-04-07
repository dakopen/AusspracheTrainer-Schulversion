from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.http import JsonResponse
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, views, generics
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from .models import School, Course
from .serializers import UserSerializer, SchoolSerializer, CourseSerializer
from .permissions import IsAdminOrSecretaryCreatingAllowedRoles, IsAdmin, IsTeacher, IsTeacherOrAdmin

import logging
logger = logging.getLogger(__name__)


User = get_user_model()

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello, world!"})


class CreateAnyRoleView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def perform_create(self, serializer):
        serializer.save()  # make sure to add school and role in the data sent


class CreateTeacherView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrSecretaryCreatingAllowedRoles]

    def perform_create(self, serializer):
        # If the creator is a secretary, set the school to their school
        if self.request.user.role == self.request.user.SECRETARY:
            serializer.save(school=self.request.user.school, role=User.TEACHER)
        else:
            serializer.save(role=User.TEACHER)

class CreateStudyStudentView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsTeacher]

    def perform_create(self, serializer):
        serializer.save(school=self.request.user.school, role=User.STUDYSTUDENT)


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
    

class SchoolListView(generics.ListAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAdmin]


class SchoolCreateView(generics.CreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAdmin]


class CourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.ADMIN:
            return Course.objects.all()
        else:
            return Course.objects.filter(teacher=user)
        

class CourseCreateView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsTeacher]

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_object(self):
        """
        Override the get_object method to ensure that we can fetch the course
        instance based on the provided `pk` in the URL.
        """
        pk = self.kwargs.get('pk')
        course = get_object_or_404(Course, pk=pk)

        user = self.request.user
        if user.role == User.ADMIN or (user.role == User.TEACHER and course.teacher == user):
            return course
        else:
            raise PermissionDenied({'message': 'Du hast nicht die Berechtigung, diesen Kurs anzuzeigen.'})
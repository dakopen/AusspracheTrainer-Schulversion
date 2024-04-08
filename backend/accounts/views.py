from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, views, generics
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from .models import School, Course
from .serializers import UserSerializer, SchoolSerializer, CourseSerializer
from .permissions import IsAdminOrSecretaryCreatingAllowedRoles, IsAdmin, IsSecretaryOrAdmin, \
                        IsTeacher, IsTeacherOrAdmin, IsTeacherOrSecretaryOrAdmin

import logging
logger = logging.getLogger(__name__)

import random
import string

from backend.settings import DEBUG

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
        user.is_active = True  # activate the user
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

class SchoolDetailView(generics.RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsSecretaryOrAdmin]
    
    def get_object(self):
        """
        Override the get_object method to ensure that we can fetch the course
        instance based on the provided `pk` in the URL.
        """
        pk = self.kwargs.get('pk')
        school = get_object_or_404(School, pk=pk)

        user = self.request.user
        if user.role == User.ADMIN or (user.role == User.SECRETARY and school == user.school):
            return school
        else:
            raise PermissionDenied({'message': 'Du hast nicht die Berechtigung, diese Schule anzuzeigen.'})

class SchoolTeacherListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsSecretaryOrAdmin]

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        school = get_object_or_404(School, pk=pk)

        user = self.request.user
        if user.role == User.ADMIN or (user.role == User.SECRETARY and school == user.school):
            return User.objects.filter(school=school, role=User.TEACHER)
        else:
            raise PermissionDenied({'message': 'Du hast nicht die Berechtigung, die Lehrer dieser Schule anzuzeigen.'})

class SchoolSecretaryListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        school = get_object_or_404(School, pk=pk)

        return User.objects.filter(school=school, role=User.SECRETARY)

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
    permission_classes = [IsTeacherOrSecretaryOrAdmin]

    def get_object(self):
        """
        Override the get_object method to ensure that we can fetch the course
        instance based on the provided `pk` in the URL.
        """
        pk = self.kwargs.get('pk')
        course = get_object_or_404(Course, pk=pk)

        user = self.request.user
        if user.role == User.ADMIN or (user.role == User.TEACHER and course.teacher == user) or (user.role == User.SECRETARY and course.teacher.school == user.school):
            return course
        else:
            raise PermissionDenied({'message': 'Du hast nicht die Berechtigung, diesen Kurs anzuzeigen.'})
        

class CourseStudentListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsTeacherOrSecretaryOrAdmin]

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        course = get_object_or_404(Course, pk=pk)

        user = self.request.user
        if user.role == User.ADMIN or (user.role == User.TEACHER and course.teacher == user) or (user.role == User.SECRETARY and course.teacher.school == user.school):
            return course.students.all()
        else:
            raise PermissionDenied({'message': 'Du hast nicht die Berechtigung, die Schüler dieses Kurses anzuzeigen.'})
        
class CourseStudentCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsTeacherOrSecretaryOrAdmin]

    def perform_create(self, serializer):
        pk = self.kwargs.get('pk')
        course = get_object_or_404(Course, pk=pk)

        user = self.request.user
        if user.role == User.ADMIN or (user.role == User.TEACHER and course.teacher == user) or (user.role == User.SECRETARY and course.teacher.school == user.school):
            serializer.save(belongs_to_course=course)
        else:
            raise PermissionDenied({'message': 'Du hast nicht die Berechtigung, Schüler zu diesem Kurs hinzuzufügen.'})


class BulkCreateStudyStudentsView(APIView):
    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        number_of_students = request.data.get('number_of_students', 10)  # Default to 10 if not specified
        max_number_of_students = 100

        # Convert to integer and ensure it's within allowed bounds
        try:
            number_of_students = int(''.join(filter(str.isdigit, str(number_of_students))))
        except ValueError:  # In case of conversion failure
            number_of_students = 10  # Default back to 10

        # Adjust number to not exceed maximum allowed students per course
        number_of_students = min(number_of_students, max_number_of_students - course.students.count())

        if DEBUG:  # TODO: Change later, but db.sqlite does not allow autoincrement for bulk_create
            with transaction.atomic():
                for _ in range(number_of_students):
                    username = self.generate_random_username()
                    study_student = User.objects.create(
                        username=f"{username}@studie.aussprachetrainer.org",
                        school=course.teacher.school,
                        role=User.STUDYSTUDENT,
                        belongs_to_course=course,
                        is_active=True,
                    )
                    study_student.set_password(username)
                    study_student.save()

        else:
            study_students = []
            for _ in range(number_of_students):
                username = self.generate_random_username()

                study_student = User.objects.create(
                    
                    username=f"{username}@studie.aussprachetrainer.org",
                    password=make_password(username),
                    school=course.teacher.school,
                    role=User.STUDYSTUDENT,
                    belongs_to_course=course,
                    is_active=True,
                )
                study_students.append(study_student)

            with transaction.atomic():
                User.objects.bulk_create(study_students)


        return Response({'message': f'{number_of_students} study students created successfully for course {course.name}.'},
                        status=status.HTTP_201_CREATED)

    def generate_random_username(self):
        while True:
            username = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
            if not User.objects.filter(username=f"{username}@studie.aussprachetrainer.org").exists():
                return username

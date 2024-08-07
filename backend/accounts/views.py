from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, views, generics
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from backend import settings
from datetime import date
from django.db import connection

from .utils import generate_random_username, create_pdf_for_usernames
from .models import School, Course, ChangedUsernames
from .serializers import UserEmailSerializer, UserSerializer, SchoolSerializer, CourseSerializer, ChangedUsernamesSerializer, \
                        AccountsHealthCheckSerializer
from .permissions import IsAdminOrSecretaryCreatingAllowedRoles, IsAdmin, IsSecretaryOrAdmin, \
                        IsTeacher, IsTeacherOrAdmin, IsTeacherOrSecretaryOrAdmin, IsStudystudent

from todo.views import complete_user_todo_user_and_standard_todo

import logging
logger = logging.getLogger(__name__)

import random
import string

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
            return course.students.all().order_by('-created_at')
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

        # if settings.DEBUG or connection.vendor == "sqlite":  # TODO: Change later, but db.sqlite does not allow autoincrement for bulk_create
        with transaction.atomic():
            zero_or_one = random.randint(0, 1)
            for i in range(number_of_students):
                username = generate_random_username()
                study_student = User.objects.create(
                    username=f"{username}@studie.aussprachetrainer.org",
                    school=course.teacher.school,
                    role=User.STUDYSTUDENT,
                    belongs_to_course=course,
                    is_active=True,
                    language=course.language,
                    full_access_group=(i % 2 == zero_or_one),  # so when only 1 student is created, it's still random
                )
                study_student.set_password(username)
                study_student.save()

        """
        else:
            study_students = []
            zero_or_one = random.randint(0, 1)
            for i in range(number_of_students):
                username = generate_random_username()
                study_student = User.objects.create( 
                    username=f"{username}@studie.aussprachetrainer.org",
                    password=make_password(username),
                    school=course.teacher.school,
                    role=User.STUDYSTUDENT,
                    belongs_to_course=course,
                    is_active=True,
                    language=course.language,
                    full_access_group=(i % 2 == zero_or_one),  # so when only 1 student is created, it's still random

                )
                study_students.append(study_student)

            with transaction.atomic():
                User.objects.bulk_create(study_students)
        """

        return Response({'message': f'{number_of_students} study students created successfully for course {course.name}.'},
                        status=status.HTTP_201_CREATED)


class CourseUpdateView(APIView):
    permission_classes = [IsTeacherOrSecretaryOrAdmin]

    def patch(self, request, pk):
        pk = self.kwargs.get('pk')
        course = get_object_or_404(Course, pk=pk)
        if not course:
            return Response({'message': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        
        user = self.request.user
        if not (user.role == User.ADMIN or (user.role == User.TEACHER and course.teacher == user) or (user.role == User.SECRETARY and course.teacher.school == user.school)):
            raise PermissionDenied({'message': 'Du hast nicht die Berechtigung, Schüler zu diesem Kurs hinzuzufügen.'})
        
        if 'language' in request.data:
            del request.data['language']  # Prevent changing the language of the course

        if request.data.get('study_started') and request.data['study_started']:
            request.data['start_date'] = date.today()

        serializer = CourseSerializer(course, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class SubmitStudyStudentEmailView(APIView):
    permission_classes = [IsStudystudent]  # Ensure the user is authenticated

    def post(self, request):
        user = request.user  # Obtain the user from the request
        serializer = UserEmailSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save() 

            # complete the todo
            complete_user_todo_user_and_standard_todo(user, 1)

            return Response({'message': 'Email address updated successfully.'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        



class RequestDeleteAccountView(APIView):
    permission_classes = [IsStudystudent]

    def post(self, request):
        user = request.user
        if not user.email:
            return Response({"error": "No email address set for the user."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate a token and encode the user's ID
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Build the URL for the confirmation link
        delete_url = f"http://127.0.0.1:3000/delete-account-confirm/{uidb64}/{token}/"
        
        # Send an email with the link
        send_mail(
            subject="Bestätigung der Löschung Ihres Kontos der AusspracheTrainer-Studie",
            message=f"Bitte bestätigen Sie die Löschung Ihres Kontos der AusspracheTrainer-Studie, indem Sie auf diesen Link klicken: {delete_url} \n Ihre Daten werden unwiderruflich gelöscht.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        
        return Response({"message": "Der Bestätigungslink wird an Ihre E-Mail-Adresse gesendet."}, status=status.HTTP_200_OK)

class DeleteAccountConfirmView(APIView):
    def post(self, request, *args, **kwargs):
        # get the uidb64 and token from the url
        uidb64 = kwargs.get('uidb64')
        token = kwargs.get('token')
        
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError):
            return Response({"error": "Invalid UID. Unable to decode UID."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User does not exist. Invalid UID."}, status=status.HTTP_404_NOT_FOUND)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid token or token has expired."}, status=status.HTTP_400_BAD_REQUEST)

        # Deletes the user account
        user.delete()
        return Response({"message": "Your account has been successfully deleted."}, status=status.HTTP_200_OK)

class ChangeUsernameView(APIView):
    permission_classes = [IsStudystudent]

    def post(self, request):
        user = request.user
        old_username = user.username
        new_username = generate_random_username()

        # Update the username in the database
        user.username = f"{new_username}@studie.aussprachetrainer.org"
        user.set_password(new_username)


        user.save(update_fields=['username', 'password'])

        ChangedUsernames.objects.create(
            user=user,
            old_username=old_username,
            new_username=user.username,
        )

        # Send an email with the new username
        if user.email:
            send_mail(
                subject="Dein AusspracheTrainer Benutzername wurde geändert",
                message=f"Hallo, dein neuer Benutzername für die Studie lautet: {new_username}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )

        return Response({"message": f"Dein Benutzername wurde geändert zu {new_username}."}, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        logger.warn("email: %s", email)
        try:
            user = User.objects.get(username=email)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            password_reset_link = f"{settings.FRONTEND_URL}/set-password/?token={token}&uid={uidb64}"

            send_mail(
                subject='Passwort zurücksetzen',
                message=f'Klicke auf diesen Link um dein Passwort zurückzusetzen: {password_reset_link}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.username],
                fail_silently=False,
            )
            return Response({'message': 'Ein Wiederherstellungscode wurde an deine Mail gesendet.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'No user found with this email address.'}, status=status.HTTP_404_NOT_FOUND)
        

class PasswordResetView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            return Response({"error": "Invalid or expired link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        password = request.data.get('password')
        user.set_password(password)
        user.save()
        return Response({"success": "Your password has been reset successfully."}, status=status.HTTP_200_OK)
    

class ForgotUsernameView(APIView):

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email address is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            usernames = []
            users = User.objects.filter(email=email)
            i = 1
            for user in users:
                if user.role != User.STUDYSTUDENT:
                    return Response({'error': 'Nur Schüler:innen können ihren Benutzernamen anfordern.'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    usernames.append(f'{i}) {user.username[:10]}')
                    i += 1
            
            if len(usernames) > 1:
                message = "Folgende Benutzernamen sind mit deiner Email Adresse verknüpft:\n" + "\n".join(usernames)

            elif len(usernames) == 1:
                message = f'Dein Benutzername lautet: {users[0].username[:10]}'
            
            else:
                return Response({'error': 'Keinen Account mit dieser Mail gefunden.'}, status=status.HTTP_404_NOT_FOUND)
            
            send_mail(
                subject='Dein AusspracheTrainer-Studie Benutzername',
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            return Response({'message': 'Dein Benutzername wurde an die hinterlegte Email Adresse gesendet.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Keinen Account mit dieser Mail gefunden.'}, status=status.HTTP_404_NOT_FOUND)


class CourseChangedUsernamesView(APIView):
    permission_classes = [IsTeacherOrSecretaryOrAdmin]

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            if not course:
                return Response({'message': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
            
            user = self.request.user
            if not (user.role == User.ADMIN or (user.role == User.TEACHER and course.teacher == user) or (user.role == User.SECRETARY and course.teacher.school == user.school)):
                raise PermissionDenied({'message': 'Du hast nicht die Berechtigung, Schüler zu diesem Kurs hinzuzufügen.'})
            
        except Course.DoesNotExist:
            return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

        changed_usernames = ChangedUsernames.objects.filter(user__belongs_to_course=course)
        serializer = ChangedUsernamesSerializer(changed_usernames, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class GenerateAndDownloadPDFView(APIView):
    permission_classes = [IsTeacherOrSecretaryOrAdmin]

    def post(self, request, course_id):

        # check if the course belongs to the teacher or the course teacher school belongs to the secretary
        course = get_object_or_404(Course, pk=course_id)
        user = self.request.user
        if not (user.role == User.ADMIN or (user.role == User.TEACHER and course.teacher == user) or (user.role == User.SECRETARY and course.teacher.school == user.school)):
            raise PermissionDenied({'message': 'Du hast nicht die Berechtigung.'})
        
        usernames = [user.username[:10] for user in course.students.all().order_by('-created_at')]

        presigned_url = create_pdf_for_usernames(usernames, course.name, course_id)
        return JsonResponse({'url': presigned_url})
    
class CheckUserFinishedStudyAndDownloadedReport(APIView):
    permission_classes = [IsStudystudent]

    def get(self, request):
        user = request.user
        return Response({'finished_study': user.finished_study, 'downloaded_report': user.downloaded_report}, status=status.HTTP_200_OK)



class MarkUserReportAsDownloadedView(APIView):
    permission_classes = [IsStudystudent]

    def post(self, request):
        user = request.user
        user.downloaded_report = True
        user.save()

        return Response({'message': 'User report marked as downloaded.'}, status=status.HTTP_200_OK)
    
class HealthCheckView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, format=None):
        schools_data = []

        for school in School.objects.all():
            total_teachers = User.objects.filter(role=User.TEACHER, school=school).count()
            total_courses = Course.objects.filter(teacher__school=school).count()
            
            schools_data.append({
                'name': school.name,
                'address': school.address,
                'total_teachers': total_teachers,
                'total_courses': total_courses,
            })

        data = {
            'schools': schools_data,
        }

        serializer = AccountsHealthCheckSerializer(data=data)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
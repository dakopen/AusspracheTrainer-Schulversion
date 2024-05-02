from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from accounts.permissions import IsStudystudentOrTeacher, IsTeacherOrSecretaryOrAdmin
from .models import StandardToDo, UserToDo, ToDoDates
from .serializers import StandardToDoSerializer, UserToDoSerializer, ToDoDatesSerializer
from datetime import timedelta, datetime
import logging

from django.utils.dateparse import parse_datetime

from accounts.models import Course

User = get_user_model()
logger = logging.getLogger(__name__)

class UserToDoView(APIView):
    permission_classes = [IsStudystudentOrTeacher]

    def get(self, request):
        todos = UserToDo.objects.filter(user=request.user, completed=False)
        serializer = UserToDoSerializer(todos, many=True)
        return Response(serializer.data)

class SingleUserToDoView(APIView):
    permission_classes = [IsStudystudentOrTeacher]

    def get(self, request):
        todos = UserToDo.objects.filter(user=request.user, completed=False)
        lowest_prio_todo = todos.order_by('standard_todo__priority').first()
        if lowest_prio_todo is None:
            return Response({})
        serializer = StandardToDoSerializer(lowest_prio_todo.standard_todo)
        return Response(serializer.data)


def create_user_todo_for_all_users_in_course(standard_todo_id, course_id, due_date=None):
    """
    Create a UserToDo instance for all users based on a StandardToDo id.
    """
    standard_todo = StandardToDo.objects.get(id=standard_todo_id)
    users = User.objects.filter(course_id=course_id)
    
    user_todos = [
        UserToDo(user=user, standard_todo=standard_todo, due_date=due_date or timezone.now() + timezone.timedelta(days=7))
        for user in users
    ]
    UserToDo.objects.bulk_create(user_todos)

def complete_user_todo_by_id(user_todo_id):
    """
    Marks a UserToDo as complete and sets the completion date.
    """
    user_todo = UserToDo.objects.get(id=user_todo_id)
    user_todo.completed = True
    user_todo.completion_date = timezone.now()
    user_todo.save()


def complete_user_todo_user_and_standard_todo(user, standard_todo):
    """
    Marks a UserToDo as complete and sets the completion date.
    """
    user_todo = UserToDo.objects.get(user=user, standard_todo=standard_todo)
    user_todo.completed = True
    user_todo.completion_date = timezone.now()
    user_todo.save()


def reset_user_todo(user_todo_id):
    """
    Resets a UserToDo to be incomplete and clears the completion date.

    :param user_todo_id: ID of the UserToDo instance to reset.
    """
    user_todo = UserToDo.objects.get(id=user_todo_id)
    user_todo.completed = False
    user_todo.completion_date = None
    user_todo.save()


def delete_user_todo(user_todo_id):
    """
    Deletes a UserToDo instance.

    :param user_todo_id: ID of the UserToDo instance to delete.
    """
    user_todo = UserToDo.objects.get(id=user_todo_id)
    user_todo.delete()


class ToDoDatesView(APIView):
    permission_classes = [IsTeacherOrSecretaryOrAdmin]  # Assuming you want the API to be accessed by authenticated users

    def get(self, request, course_id):
        # Check if the course exists and retrieve it
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'message': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is authorized to view this course's ToDoDates
        user = self.request.user
        if not (user.role == User.ADMIN or (user.role == User.TEACHER and course.teacher == user) or (user.role == User.SECRETARY and course.teacher.school == user.school)):
            return Response({'message': 'You do not have permission to view these dates'}, status=status.HTTP_403_FORBIDDEN)


        # Check if the study has started
        if not course.study_started:
            return Response({'message': 'Study has not started'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch and serialize the ToDoDates related to the course
        todo_dates = ToDoDates.objects.filter(course=course)
        serializer = ToDoDatesSerializer(todo_dates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, course_id, standard_todo):
        logger.warn("ToDoDatesView patch")
        logger.warn(f"Course ID: {course_id}")
        logger.warn(f"Standard ToDo: {standard_todo}")
        
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'message': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user
        if not (user.role == User.ADMIN or (user.role == User.TEACHER and course.teacher == user) or (user.role == User.SECRETARY and course.teacher.school == user.school)):
            return Response({'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        try:
            date_instance = ToDoDates.objects.get(standard_todo=standard_todo, course=course)
        except ToDoDates.DoesNotExist:
            return Response({'message': 'ToDo Date not found'}, status=status.HTTP_404_NOT_FOUND)

        # Deserialize data and update ToDoDates
        serializer = ToDoDatesSerializer(date_instance, data=request.data, partial=True)
        if serializer.is_valid():
            # Adjust the time for activation_date and due_date
            if 'activation_date' in request.data:
                activation_time = parse_datetime(request.data['activation_date'])
                if activation_time:
                    activation_time = activation_time.replace(hour=17, minute=0, second=0, microsecond=0)
                    serializer.validated_data['activation_date'] = activation_time

            if 'due_date' in request.data:
                due_time = parse_datetime(request.data['due_date'])
                if due_time:
                    due_time = due_time.replace(hour=16, minute=59, second=0, microsecond=0)
                    serializer.validated_data['due_date'] = due_time
            
            serializer.save()
            # Log the successful update
            logger.warn("ToDo date updated successfully")
            return Response({'message': 'ToDoDates updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            # Log the errors
            logger.warn("Serializer errors: " + str(serializer.errors))
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
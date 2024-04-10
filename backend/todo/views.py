from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsStudystudentOrTeacher
from .models import StandardToDo, UserToDo
from .serializers import StandardToDoSerializer, UserToDoSerializer

User = get_user_model()

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

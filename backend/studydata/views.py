from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.permissions import IsStudystudent
from .models import FirstQuestionnaire
from .serializers import FirstQuestionnaireSerializer
from todo.views import complete_user_todo_user_and_standard_todo


class FirstQuestionnaireView(APIView):
    permission_classes = [IsStudystudent]

    def post(self, request, *args, **kwargs):
        serializer = FirstQuestionnaireSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            complete_user_todo_user_and_standard_todo(request.user, 2)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

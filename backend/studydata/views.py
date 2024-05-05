from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
import uuid
import io
from pydub import AudioSegment
from django.core.files.base import ContentFile

from accounts.permissions import IsStudystudent, IsAuthenticated, IsTeacherOrSecretaryOrAdmin, IsAdmin, IsStudystudentOrTeacher
from todo.views import complete_user_todo_user_and_standard_todo
import backend.settings

from accounts.models import Course
from .tasks import async_pronunciation_assessment
from .models import FirstQuestionnaire, StudySentences, StudySentencesCourseAssignment
from .serializers import FirstQuestionnaireSerializer, AudioAnalysisSerializer, \
    StudySentencesSerializer, StudySentencesCourseAssignmentSerializer, FinalQuestionnaireSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

User = get_user_model()

class FirstQuestionnaireView(APIView):
    permission_classes = [IsStudystudent]

    def post(self, request, *args, **kwargs):
        serializer = FirstQuestionnaireSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            complete_user_todo_user_and_standard_todo(request.user, 2)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FinalQuestionnaireView(APIView):
    permission_classes = [IsStudystudent]

    def post(self, request, *args, **kwargs):
        serializer = FinalQuestionnaireSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            complete_user_todo_user_and_standard_todo(request.user, 13)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AudioAnalysisView(APIView):
    permission_classes = [IsStudystudent]

    def post(self, request, *args, **kwargs):
        serializer = AudioAnalysisSerializer(data=request.data)
        if serializer.is_valid():
            audio_file = request.FILES['audio']
            sentence_id = serializer.validated_data['sentence_id']  # TODO: Change later to sentence_id
            audio_mimetype = serializer.validated_data['audio_mimetype']


            logger.warn(f"Initiating analysis for sentence with id {sentence_id} with mimetype {audio_mimetype}")

            # Create an AudioSegment instance from the uploaded file depending on the MIME type
            try:
                if audio_mimetype == "audio/ogg":
                    audio_segment = AudioSegment.from_ogg(audio_file)
                elif audio_mimetype == "audio/wav":
                    audio_segment = AudioSegment.from_wav(audio_file)
                elif audio_mimetype == "audio/mp4":
                    audio_segment = AudioSegment.from_file(audio_file, format="mp4")
                elif audio_mimetype == "audio/mpeg":
                    audio_segment = AudioSegment.from_mp3(audio_file)
                elif audio_mimetype == "audio/webm":
                    audio_segment = AudioSegment.from_file(audio_file, format="webm")
                else:
                    return Response({'error': 'Unsupported audio format'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Error processing audio file: {str(e)}")
                return Response({'error': 'Error processing the audio file'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Limit audio segment to 59 seconds
            if len(audio_segment) > 59000:
                audio_segment = audio_segment[:59000]

            # Export audio segment to WAV format
            buffer = io.BytesIO()
            audio_segment.export(buffer, format="wav")
            buffer.seek(0)
            content_file = ContentFile(buffer.read())

            # Save the processed file to disk
            random_name = str(uuid.uuid4()) + ".wav"
            file_path = str(backend.settings.MEDIA_ROOT) + '/audio_files/' + random_name
            with open(file_path, 'wb+') as destination:
                destination.write(content_file.read())
            

            # Dispatch the pronunciation assessment task to Celery
            task = async_pronunciation_assessment.delay(file_path, sentence_id, request.user.belongs_to_course.language, user_id=request.user.id)

            return Response({'task_id': task.id}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudySentencesListView(APIView):
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method == "GET":
            self.permission_classes = [IsTeacherOrSecretaryOrAdmin]
        else:  # For POST, PUT, DELETE methods
            self.permission_classes = [IsAdmin]
        return super().get_permissions()

    def get(self, request, *args, **kwargs):
        study_sentences = StudySentences.objects.all()
        serializer = StudySentencesSerializer(study_sentences, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        # Check if the posted data is a list, indicating bulk upload
        if isinstance(data, list):
            serializer = StudySentencesSerializer(data=data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = StudySentencesSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        sentence_id = kwargs.get('sentence_id')
        try:
            study_sentence = StudySentences.objects.get(id=sentence_id)
        except StudySentences.DoesNotExist:
            return Response({'error': 'Study sentence not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudySentencesSerializer(study_sentence, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def delete(self, request, *args, **kwargs):
        sentence_id = kwargs.get('sentence_id')
        try:
            study_sentence = StudySentences.objects.get(id=sentence_id)
            study_sentence.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except StudySentences.DoesNotExist:
            return Response({'error': 'Study sentence not found'}, status=status.HTTP_404_NOT_FOUND)


class RetrieveStudySentenceById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        sentence_id = kwargs.get('sentence_id')
        try:
            study_sentence = StudySentences.objects.get(id=sentence_id)
            serializer = StudySentencesSerializer(study_sentence)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except StudySentences.DoesNotExist:
            return Response({'error': 'Study sentence not found'}, status=status.HTTP_404_NOT_FOUND)


class RetrieveStudySentencesByCourseAndLocation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):  # Changed from post to get for semantic correctness
        user = request.user
        if user.role not in [User.TEACHER, User.SECRETARY, User.ADMIN, User.STUDYSTUDENT]:
            return Response({'message': 'You do not have permission to view these sentences'}, status=status.HTTP_403_FORBIDDEN)

        # Determine the course based on the user role
        if user.role in [User.TEACHER, User.SECRETARY, User.ADMIN]:
            course_id = request.query_params.get('course_id')
            course = get_object_or_404(Course, pk=course_id)
        elif user.role == User.STUDYSTUDENT:
            course = user.belongs_to_course
        else:
            return Response({'message': 'Invalid user role'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve start_location and end_location from query parameters
        start_location = request.query_params.get('start_location')
        end_location = request.query_params.get('end_location')

        if not start_location or not end_location:
            return Response({'error': 'Start and end location are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch sentences with optimization
        sentences = StudySentencesCourseAssignment.objects.select_related('sentence').filter(
            course=course,
            location_value__range=(int(start_location), int(end_location))
        )

        serializer = StudySentencesCourseAssignmentSerializer(sentences, many=True, context={'request': request})
        return Response(serializer.data)
    


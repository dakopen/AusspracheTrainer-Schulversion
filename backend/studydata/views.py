from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
import uuid
import io
from pydub import AudioSegment
from django.core.files.base import ContentFile

from accounts.permissions import IsStudystudent
from todo.views import complete_user_todo_user_and_standard_todo
import backend.settings

from .tasks import async_pronunciation_assessment
from .models import FirstQuestionnaire
from .serializers import FirstQuestionnaireSerializer, AudioAnalysisSerializer


logger = logging.getLogger(__name__)


class FirstQuestionnaireView(APIView):
    permission_classes = [IsStudystudent]

    def post(self, request, *args, **kwargs):
        serializer = FirstQuestionnaireSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            complete_user_todo_user_and_standard_todo(request.user, 2)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AudioAnalysisView(APIView):
    permission_classes = [IsStudystudent]

    def post(self, request, *args, **kwargs):
        serializer = AudioAnalysisSerializer(data=request.data)
        if serializer.is_valid():
            audio_file = request.FILES['audio']
            text = serializer.validated_data['text']
            audio_mimetype = serializer.validated_data['audio_mimetype']

            logger.warn(f"Initiating analysis for {text} with mimetype {audio_mimetype}")

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
            
            logger.warn(f"Saved audio file to {file_path}")

            # Dispatch the pronunciation assessment task to Celery
            task = async_pronunciation_assessment.delay(file_path, text, request.user.belongs_to_course.language, user_id=request.user.id)

            return Response({'task_id': task.id}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


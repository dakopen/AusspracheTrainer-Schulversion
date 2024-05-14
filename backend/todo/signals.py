from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import StandardToDo, UserToDo, ToDoDates
from studydata.views import prepare_for_analysis

from accounts.models import Course
from studydata.models import TestSentencesWithAudio, PronunciationAssessmentResult
from studydata.tasks import async_pronunciation_assessment
import logging
logger = logging.getLogger(__name__)

User = get_user_model()

@receiver(post_save, sender=User)
def link_initial_todos_to_student(sender, instance, created, **kwargs):
    if created and instance.role == User.STUDYSTUDENT:
        # if the course has already started, add the todos to the student
        
        course_todos = ToDoDates.objects.filter(course=instance.belongs_to_course)
        for todo_date in course_todos:
            UserToDo.objects.create(
                user=instance,
                todo_date=todo_date
            )
        """
        initial_todos = StandardToDo.objects.filter(id__in=[1, 2, 3])

        for std_todo in initial_todos:
            UserToDo.objects.create(
                user=instance,
                standard_todo=std_todo,
            )
        
        weekly_todos_and_final_todos = StandardToDo.objects.filter(id__in=[5, 6, 7, 8, 9, 10, 11, 12, 13])

        for std_todo in weekly_todos_and_final_todos:
            UserToDo.objects.create(
                user=instance,
                standard_todo=std_todo,
            )
        """
        """
        for std_todo in StandardToDo.objects.all():
            UserToDo.objects.create(
                user=instance,
                standard_todo=std_todo,
            )
        """
@receiver(pre_save, sender=Course)
def add_course_due_dates(sender, instance, **kwargs):
    logger.warn("add_course_due_dates")
    if instance.id is not None:
        # Instance is being updated
        logger.warn("add_course_due_dates - instance is being updated")
        old_instance = Course.objects.get(id=instance.id)
        if instance.study_started != old_instance.study_started:
            if instance.study_started:
                today_00_01 = timezone.now().replace(hour=0, minute=1, second=0, microsecond=0)
                today_16_59 = timezone.now().replace(hour=16, minute=59, second=0, microsecond=0)
                today_17_00 = timezone.now().replace(hour=17, minute=0, second=0, microsecond=0)
                
                for todo in StandardToDo.objects.filter(id__in=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]):
                    todo_date, created = ToDoDates.objects.get_or_create(
                        course=instance,
                        standard_todo=todo,
                        defaults={
                            'activation_date': today_17_00 if todo.id in range(5, 11) else timezone.now(),
                            'due_date': today_16_59 + timezone.timedelta(days=7*(todo.id - 4)) if todo.id in range(5, 11) else timezone.now() + timezone.timedelta(days=365)
                        }
                    )
                    if not created:
                        todo_date.activation_date = today_17_00 if todo.id in range(5, 11) else timezone.now()
                        todo_date.due_date = today_16_59 + timezone.timedelta(days=7*(todo.id - 4)) if todo.id in range(5, 11) else timezone.now() + timezone.timedelta(days=365)
                        todo_date.save()
            else:
                # Set due_date to now instead of deleting
                now = timezone.now()
                instance.activate_final_test = False
                ToDoDates.objects.filter(course=instance).update(due_date=now, activation_date=now)

        if instance.activate_final_test != old_instance.activate_final_test and old_instance.study_started:
            if instance.activate_final_test:
                for todo in StandardToDo.objects.filter(id__in=[11, 12, 13]):
                    todo_date, created = ToDoDates.objects.get_or_create(
                        course=instance,
                        standard_todo=todo,
                        defaults={
                            'activation_date': timezone.now(),
                            'due_date': timezone.now() + timezone.timedelta(days=21),
                        }
                    )
                    if not created:
                        todo_date.activation_date = timezone.now()
                        todo_date.due_date = timezone.now() + timezone.timedelta(days=21)
                        todo_date.save()
            else:
                # Set due_date to now instead of deleting
                now = timezone.now()
                ToDoDates.objects.filter(course=instance, standard_todo__in=[11, 12, 13]).update(due_date=now, activation_date=now)



@receiver(post_save, sender=ToDoDates)
def add_todos_to_user(sender, instance, created, **kwargs):
    if created:
        for user in instance.course.students.all():
            UserToDo.objects.create(
                user=user,
                todo_date=instance,
            )

@receiver(post_save, sender=UserToDo)
def trigger_analysis_on_completion(sender, instance, created, **kwargs):
    if instance.todo_date.standard_todo.id == 12 and instance.completed:
        user = instance.user

        # get all files and sentences:
        test_sentences = TestSentencesWithAudio.objects.filter(user=user)
        for test_sentence in test_sentences:
            # retrieve the audio file
            audio_file_path = test_sentence.audio_file_path
            # retrieve the sentence
            sentence_id = test_sentence.sentence.id
            prepare_for_analysis(audio_file_path, sentence_id, user.belongs_to_course.language, user_id=user.id)
        
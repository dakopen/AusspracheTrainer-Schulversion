from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import StandardToDo, UserToDo, ToDoDates

from accounts.models import Course
import logging
logger = logging.getLogger(__name__)

User = get_user_model()

@receiver(post_save, sender=User)
def link_initial_todos_to_student(sender, instance, created, **kwargs):
    if created and instance.role == User.STUDYSTUDENT:

        """
        initial_todos = StandardToDo.objects.filter(id__in=[1, 2, 3, 4])

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
        
        for std_todo in StandardToDo.objects.all():
            UserToDo.objects.create(
                user=instance,
                standard_todo=std_todo,
            )


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
                
                
                # create a new ToDoDates instance for each StandardToDo 
                for todo in StandardToDo.objects.all():
                    if todo.id in [1, 2, 3, 4]:
                        todo_date = ToDoDates.objects.create(
                            course=instance,
                            standard_todo=todo,
                            activation_date = timezone.now(),
                            due_date = timezone.now() + timezone.timedelta(days=365),
                        )
                        
                    elif todo.id in [5, 6, 7, 8, 9, 10]:
                        todo_date = ToDoDates.objects.create(
                            course=instance,
                            standard_todo=todo,
                            activation_date = today_17_00 + timezone.timedelta(days=7*(todo_date.standard_todo.id - 5)),  # 7 days * week
                            due_date = today_16_59 + timezone.timedelta(days=7*(todo_date.standard_todo.id - 4))   # 7 days * (week + 1)
                        )
                    elif todo.id in [11, 12, 13]:
                        todo_date = ToDoDates.objects.create(
                            course=instance,
                            standard_todo=todo,
                            activation_date = today_00_01 + timezone.timedelta(days=7*6),  # 7 days * 6
                            due_date =  today_00_01 + timezone.timedelta(days=7*9)  # 7 days * 9 weeks, at latest
                        )
                    todo_date.save()
            else:
                # ToDoDates.objects.filter(course=instance).delete()
                pass

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import StandardToDo, UserToDo


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
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import StandardToDo, UserToDo


User = get_user_model()

@receiver(post_save, sender=User)
def link_initial_todos_to_student(sender, instance, created, **kwargs):
    if created and instance.role == User.STUDYSTUDENT:
        # Filter StandardToDo items by priority 1 or 2 (E-Mail Adresse ergänzen and Ersten Fragebogen ausfüllen)
        priority_todos = StandardToDo.objects.filter(priority__in=[1, 2])

        for std_todo in priority_todos:
            UserToDo.objects.create(
                user=instance,
                standard_todo=std_todo,
                due_date=timezone.now() + timezone.timedelta(days=365),  # due_data does not matter for these todos
            )
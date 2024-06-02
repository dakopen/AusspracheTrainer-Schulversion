from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class StandardToDo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.PositiveSmallIntegerField()
    action_relative_link = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.title


class ToDoDates(models.Model):
    course = models.ForeignKey('accounts.Course', on_delete=models.CASCADE, related_name='todo_dates')
    standard_todo = models.ForeignKey(StandardToDo, on_delete=models.CASCADE, related_name='todo_dates')
    due_date = models.DateTimeField(default=timezone.now)
    activation_date = models.DateTimeField(default=timezone.now)
    sent_reminder = models.BooleanField(default=False)


class UserToDo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_todos')
    todo_date = models.ForeignKey(ToDoDates, on_delete=models.CASCADE, related_name='user_todos')
    completed = models.BooleanField(default=False)
    completion_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'todo_date')  # Ensures a user cannot have duplicate entries for the same StandardToDo

    def __str__(self):
        return f'{self.user.username} - {self.standard_todo.title}'
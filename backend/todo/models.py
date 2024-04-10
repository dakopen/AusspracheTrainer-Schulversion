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

class UserToDo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_todos')
    standard_todo = models.ForeignKey(StandardToDo, on_delete=models.CASCADE, related_name='user_todos')
    completed = models.BooleanField(default=False)
    completion_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'standard_todo')  # Ensures a user cannot have duplicate entries for the same StandardToDo

    def __str__(self):
        return f'{self.user.username} - {self.standard_todo.title}'

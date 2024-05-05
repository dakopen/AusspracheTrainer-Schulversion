# Generated by Django 4.2.11 on 2024-05-04 15:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('todo', '0005_remove_usertodo_activation_date_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='usertodo',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='usertodo',
            name='todo_date',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='user_todos', to='todo.tododates'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='usertodo',
            unique_together={('user', 'todo_date')},
        ),
        migrations.RemoveField(
            model_name='usertodo',
            name='standard_todo',
        ),
    ]
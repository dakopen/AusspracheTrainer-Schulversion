# Generated by Django 4.2.11 on 2024-06-02 12:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0006_alter_usertodo_unique_together_usertodo_todo_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tododates',
            name='sent_reminder',
            field=models.BooleanField(default=False),
        ),
    ]

# Generated by Django 4.2.11 on 2024-05-14 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_course_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='scheduled_final_test',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='scheduled_study_start',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]

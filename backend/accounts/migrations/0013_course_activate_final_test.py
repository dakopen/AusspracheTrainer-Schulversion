# Generated by Django 4.2.11 on 2024-05-01 11:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_course_start_date_course_study_started'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='activate_final_test',
            field=models.BooleanField(default=False),
        ),
    ]

# Generated by Django 4.2.11 on 2024-05-21 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0015_course_scheduled_final_test_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='demo',
            field=models.BooleanField(default=False),
        ),
    ]

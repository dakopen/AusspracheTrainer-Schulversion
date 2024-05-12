# Generated by Django 4.2.11 on 2024-05-06 17:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studydata', '0009_testsentenceswithaudio'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='testsentenceswithaudio',
            name='audio_file',
        ),
        migrations.AddField(
            model_name='testsentenceswithaudio',
            name='audio_file_path',
            field=models.CharField(default='Test', max_length=255),
            preserve_default=False,
        ),
    ]
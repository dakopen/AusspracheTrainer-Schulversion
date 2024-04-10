# Generated by Django 5.0.3 on 2024-04-10 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='usertodo',
            name='completed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='usertodo',
            name='completion_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

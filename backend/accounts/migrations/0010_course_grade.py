# Generated by Django 5.0.3 on 2024-04-15 15:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_user_full_access_group_user_language'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='grade',
            field=models.PositiveSmallIntegerField(default=5),
        ),
    ]

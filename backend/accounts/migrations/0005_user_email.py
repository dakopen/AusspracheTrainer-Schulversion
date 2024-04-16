# Generated by Django 5.0.3 on 2024-04-03 16:39

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_remove_user_email_alter_user_role_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='email',
            field=models.EmailField(default='test@example.com', max_length=254, validators=[django.core.validators.EmailValidator()], verbose_name='E-Mail Adresse'),
            preserve_default=False,
        ),
    ]
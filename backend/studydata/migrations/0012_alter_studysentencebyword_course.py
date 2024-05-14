# Generated by Django 4.2.11 on 2024-05-14 15:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0015_course_scheduled_final_test_and_more'),
        ('studydata', '0011_studysentencebyword'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studysentencebyword',
            name='course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.course'),
        ),
    ]

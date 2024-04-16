# Generated by Django 5.0.3 on 2024-04-11 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studydata', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='firstquestionnaire',
            name='pronunciation_skill',
            field=models.IntegerField(blank=True, choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9), (10, 10)], null=True),
        ),
        migrations.AlterField(
            model_name='firstquestionnaire',
            name='sex',
            field=models.CharField(blank=True, choices=[('m', 'Male'), ('w', 'Female'), ('d', 'Diverse')], max_length=1, null=True),
        ),
        migrations.AlterField(
            model_name='firstquestionnaire',
            name='weekly_language_contact_hours',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
    ]
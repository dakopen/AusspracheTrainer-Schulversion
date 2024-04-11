from django.core.management.base import BaseCommand
from django.utils import timezone
import datetime
from todo.models import StandardToDo

class Command(BaseCommand):
    help = 'Populates the database with standard ToDo tasks'

    standard_todos = [
        {'id': 1, 'title': 'E-Mail Adresse ergänzen', 'description': 'Um wichtige Benachrichtigungen zu erhalten und eine Wiederherstellungsmethode für dein Konto festzulegen, teile uns bitte deine E-Mail-Adresse mit.', 'priority': 1, 'action_relative_link': '/set-email/'},
        {'id': 2, 'title': 'Ersten Fragebogen ausfüllen', 'description': 'Fülle den ersten Fragebogen der Studie aus.', 'priority': 2, 'action_relative_link': '/first-questionnaire/'},
        {'id': 3, 'title': 'Tutorial', 'description': 'Bitte starte das Tutorial, um dich mit der Webseite vertraut zu machen.', 'priority': 3, 'action_relative_link': '/tutorial/'},
        {'id': 4, 'title': 'Anfangstest', 'description': 'Bitte starte den ersten Aussprachetest, der am Ende des Trainings verglichen wird. Der Test wird nicht benotet und dein:e Lehrer:in kann dein Ergebnis nicht einsehen.', 'priority': 4, 'action_relative_link': '/first-test/'},
        # Add more standard todos
    ]

    def handle(self, *args, **kwargs):
        for todo in self.standard_todos:
            StandardToDo.objects.update_or_create(
                id=todo['id'],
                defaults={
                    'title': todo['title'],
                    'description': todo['description'],
                    'priority': todo['priority'],
                    'action_relative_link': todo.get('action_relative_link', None)
                }
            )
        self.stdout.write(self.style.SUCCESS('Successfully populated standard ToDos with IDs.'))

from django.core.management.base import BaseCommand
from django.utils import timezone
import datetime
from todo.models import StandardToDo

class Command(BaseCommand):
    help = 'Populates the database with standard ToDo tasks'

    standard_todos = [
        {'title': 'E-Mail Adresse ergänzen', 'description': 'Um wichtige Benachrichtigungen zu erhalten und eine Wiederherstellungsmethode für dein Konto festzulegen, teile uns bitte deine E-Mail-Adresse mit.', 'priority': 1, 'action_relative_link': '/password-questionnaire/'},
        {'title': 'Ersten Fragebogen ausfüllen', 'description': 'Fülle den ersten Fragebogen der Studie aus.', 'priority': 2},
        {'title': 'Anfangstest', 'description': 'Bitte starte den ersten Aussprachetest, der am Ende des Trainings verglichen wird. Der Test wird nicht benotet und dein:e Lehrer:in kann dein Ergebnis nicht einsehen.', 'priority': 3},
        # Add more standard todos
    ]

    def handle(self, *args, **kwargs):
        for todo in self.standard_todos:
            existing_todo = StandardToDo.objects.filter(priority=todo['priority']).first()
            if existing_todo:
                existing_todo.title = todo['title']
                existing_todo.description = todo['description']
                existing_todo.action_relative_link = todo.get('action_relative_link', None)
                existing_todo.save()
            else:
                StandardToDo.objects.create(
                    title=todo['title'],
                    description=todo['description'],
                    priority=todo['priority']
                )
        self.stdout.write(self.style.SUCCESS('Successfully populated standard ToDos.'))

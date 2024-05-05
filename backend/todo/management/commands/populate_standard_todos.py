from django.core.management.base import BaseCommand
from django.utils import timezone
import datetime
from todo.models import StandardToDo

# python backend/manage.py populate_standard_todos
class Command(BaseCommand):
    help = 'Populates the database with standard ToDo tasks'

    standard_todos = [
        {'id': 1, 'title': 'E-Mail Adresse ergänzen', 'description': 'Um wichtige Benachrichtigungen zu erhalten und eine Wiederherstellungsmethode für dein Konto festzulegen, teile uns bitte deine E-Mail-Adresse mit.', 'priority': 10, 'action_relative_link': '/set-email/'},
        {'id': 2, 'title': 'Ersten Fragebogen ausfüllen', 'description': 'Fülle den ersten Fragebogen der Studie aus.', 'priority': 20, 'action_relative_link': '/first-questionnaire/'},
        {'id': 3, 'title': 'Tutorial starten', 'description': 'Bitte starte das Tutorial, um dich mit der Webseite vertraut zu machen.', 'priority': 30, 'action_relative_link': '/tutorial/'},
        {'id': 4, 'title': 'Anfangstest', 'description': 'Bitte starte den ersten Aussprachetest, der am Ende des Trainings verglichen wird. Der Test wird nicht benotet und dein:e Lehrer:in kann dein Ergebnis nicht einsehen.', 'priority': 40, 'action_relative_link': '/test/'},
        
        {'id': 5, 'title': 'Übung Woche 1', 'description': 'Trainiere deine Aussprache mit diesen 10 Übungssätzen.', 'priority': 50, 'action_relative_link': '/practice/'},
        {'id': 6, 'title': 'Übung Woche 2', 'description': 'Trainiere deine Aussprache mit diesen 10 Übungssätzen.', 'priority': 50, 'action_relative_link': '/practice/'},
        {'id': 7, 'title': 'Übung Woche 3', 'description': 'Trainiere deine Aussprache mit diesen 10 Übungssätzen.', 'priority': 50, 'action_relative_link': '/practice/'},
        {'id': 8, 'title': 'Übung Woche 4', 'description': 'Trainiere deine Aussprache mit diesen 10 Übungssätzen.', 'priority': 50, 'action_relative_link': '/practice/'},
        {'id': 9, 'title': 'Übung Woche 5', 'description': 'Trainiere deine Aussprache mit diesen 10 Übungssätzen.', 'priority': 50, 'action_relative_link': '/practice/'},
        {'id': 10, 'title': 'Übung Woche 6', 'description': 'Trainiere deine Aussprache mit diesen 10 Übungssätzen.', 'priority': 50, 'action_relative_link': '/practice/'},

        {'id': 11, 'title': 'Tutorial starten', 'description': 'Bitte starte das Tutorium, um dich nochmal mit der Webseite vertraut zu machen', 'priority': 45, 'action_relative_link': '/tutorial/'},  # have priority lower than the practice todos
        {'id': 12, 'title': 'Abschließender Test', 'description': 'Die Studie nähert sich dem Ende. Bitte schließe diesen Aussprachetest ab, mit der mit deinem ersten Test verglichen wird.', 'priority': 45, 'action_relative_link': '/test/'},
        {'id': 13, 'title': 'Abschließenden Fragebogen ausfüllen', 'description': 'Fülle den letzten Fragebogen dieser Studie aus. Danach erhälst du deine Ergebnisse und bist fertig mit der Studie.', 'priority': 45, 'action_relative_link': '/final-questionnaire/'},

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



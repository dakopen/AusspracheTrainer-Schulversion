from celery import shared_task
from django.core.mail import send_mail, EmailMessage
from django.utils import timezone
from todo.models import ToDoDates
import backend.settings as settings

import logging
from django.utils import formats
logger = logging.getLogger(__name__)

@shared_task
def send_reminder_emails():
    todos = ToDoDates.objects.filter(sent_reminder=False, activation_date__lte=timezone.now(), due_date__gte=timezone.now(), standard_todo_id__gte=5, standard_todo_id__lte=10, course__created_at__gte=timezone.datetime(2024, 6, 1))
    logger.warn(f"Found {len(todos)} todos")
    for todo in todos:
        todo.sent_reminder = True
        todo.save()
        
        email = EmailMessage(
            subject=f"AusspracheTrainer-Studie: das {todo.standard_todo.id - 4}. Training wartet auf dich!",
            body=f"Bitte nimm dir 5-10 Minuten erledige dein {todo.standard_todo.id - 4}. Aussprache Training auf:<br><br><a href='https://studie.aussprachetrainer.org'>studie.aussprachetrainer.org</a><br><br>Insgesamt gibt es 6 Trainings.<br><br>Viel Erfolg und vielen Dank für deine aktive Teilnahme an der Studie!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            bcc=list(todo.course.students.all().values_list('email', flat=True)),
        )
        email.content_subtype = "html"
        email.send(fail_silently=True)

        if todo.standard_todo.id == 10:
            send_mail(
                subject=f"AusspracheTrainer-Studie: Bitte planen Sie den finalen Test, denn das {todo.standard_todo.id - 4}. Training startet",
                message=f"Hallo liebe Lehrkraft,\n in einer Woche Ihre Schüler:innen mit dem Training fertig (heute startet das letzte Training). Bitte planen Sie (falls nicht schon getan) den finalen Test, um die Studie abzuschließen. Der finale Test sollte wenn möglich in frühestens 8 Tagen (1 Tag nach dem Ende des Trainings) stattfinden. Er kann aber auch erst in 2-3 Wochen stattfinden. Sie können ihn entweder planen (über die Kursansicht) oder am Testtag in der Schule kurz vor Beginn der Unterrichtsstunde starten (empfohlen; einfach auf 'heute starten' drücken).\n\nVielen Dank!",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[todo.course.teacher.username],
                fail_silently=True,
            )
        else:
            send_mail(
                subject=f"AusspracheTrainer-Studie: das {todo.standard_todo.id - 4}. Training startet",
                message=f"Hallo liebe Lehrkraft,\nbitte erinnern Sie Ihre Schüler:innen daran, dass ab heute das {todo.standard_todo.id - 4}. Training auf studie.aussprachetrainer.org verfügbar ist (es wurde auch eine Erinnerungsmail an die Schüler:innen versandt).\n\nDie Schüler:innen haben bis zum {formats.date_format(todo.due_date, 'd.m.Y')} um 18:59 Uhr Zeit, das Training zu absolvieren.\n\nProfi Tipp: In den Kurseinstellungen können Sie sowohl das Start- als auch Enddatum nach Belieben verändern.\n\nVielen Dank!",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[todo.course.teacher.username],
                fail_silently=True,
            )
        
         

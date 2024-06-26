import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend', include=['accounts.tasks', 'studydata.tasks'])

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
app.conf.result_backend = 'redis://localhost:6379/0'
app.conf.broker_connection_retry_on_startup = True

from django.urls import path
from .views import FirstQuestionnaireView

urlpatterns = [
    path('submit-first-questionnaire/', FirstQuestionnaireView.as_view(), name='submit-first-questionnaire'),
]

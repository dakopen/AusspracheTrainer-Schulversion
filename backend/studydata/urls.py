from django.urls import path
from . import views

urlpatterns = [
    path('submit-first-questionnaire/', views.FirstQuestionnaireView.as_view(), name='submit-first-questionnaire'),
    path('audio-analysis/', views.AudioAnalysisView.as_view(), name='audio-analysis'),
]

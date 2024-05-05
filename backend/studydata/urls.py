from django.urls import path
from . import views

urlpatterns = [
    path('submit-first-questionnaire/', views.FirstQuestionnaireView.as_view(), name='submit-first-questionnaire'),
    path('submit-final-questionnaire/', views.FinalQuestionnaireView.as_view(), name='submit-final-questionnaire'),
    path('audio-analysis/', views.AudioAnalysisView.as_view(), name='audio-analysis'),
    path('retrieve-sentence/<int:sentence_id>/', views.RetrieveStudySentenceById.as_view(), name='retrieve-sentence'),
    path('sentences/', views.StudySentencesListView.as_view(), name='sentences-list'),
    path('sentences/<int:sentence_id>/', views.StudySentencesListView.as_view(), name='sentences-update'),
    path('course-assignments/', views.RetrieveStudySentencesByCourseAndLocation.as_view(), name='course-assignments-sentences'),
]

from django.contrib import admin
from .models import (
    FirstQuestionnaire, FinalQuestionnaire,
    PronunciationAssessmentResult, TestSentencesWithAudio, StudySentences, 
    StudySentencesCourseAssignment, StudySentenceByWord, SynthSpeechLog
)
class FirstQuestionnaireAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_submitted', 'age', 'sex', 'pronunciation_skill', 'weekly_language_contact_hours')
    readonly_fields = ('user', 'date_submitted', 'age', 'sex', 'pronunciation_skill', 'weekly_language_contact_hours')

class FinalQuestionnaireAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_submitted', 'motivation', 'weekly_training_in_minutes', 'feeling_of_improvement')
    readonly_fields = ('user', 'date_submitted', 'motivation', 'weekly_training_in_minutes', 'feeling_of_improvement')

class PronunciationAssessmentResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_submitted', 'sentence', 'recognized_sentence', 'language', 'accuracy', 'completeness', 'fluency')
    readonly_fields = ('user', 'date_submitted', 'sentence', 'recognized_sentence', 'language', 'accuracy', 'completeness', 'fluency', 'json_response', 'json_result')

class TestSentencesWithAudioAdmin(admin.ModelAdmin):
    list_display = ('user', 'sentence', 'deleted')
    readonly_fields = ('user', 'sentence', 'deleted')

class StudySentencesAdmin(admin.ModelAdmin):
    list_display = ('sentence', 'language', 'synth_filename', 'number_of_times_assigned_as_test', 'number_of_times_assigned_as_train')

class StudySentencesCourseAssignmentAdmin(admin.ModelAdmin):
    list_display = ('course', 'sentence', 'location_value')

class StudySentenceByWordAdmin(admin.ModelAdmin):
    list_display = ('course', 'word_index', 'sentence', 'user', 'accuracy_score')
    readonly_fields = ('course', 'word_index', 'sentence', 'user', 'accuracy_score')

class SynthSpeechLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'time', 'sentence')
    readonly_fields = ('user', 'time', 'sentence')

admin.site.register(FirstQuestionnaire, FirstQuestionnaireAdmin)
admin.site.register(FinalQuestionnaire, FinalQuestionnaireAdmin)
admin.site.register(PronunciationAssessmentResult, PronunciationAssessmentResultAdmin)
admin.site.register(TestSentencesWithAudio, TestSentencesWithAudioAdmin)
admin.site.register(StudySentences, StudySentencesAdmin)
admin.site.register(StudySentencesCourseAssignment, StudySentencesCourseAssignmentAdmin)
admin.site.register(StudySentenceByWord, StudySentenceByWordAdmin)
admin.site.register(SynthSpeechLog, SynthSpeechLogAdmin)
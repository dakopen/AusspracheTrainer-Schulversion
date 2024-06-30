from rest_framework import serializers
from .models import FirstQuestionnaire, StudySentences, StudySentencesCourseAssignment, PronunciationAssessmentResult, FinalQuestionnaire, SynthSpeechLog

class FirstQuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = FirstQuestionnaire
        fields = '__all__'
        read_only_fields = ('user', 'date_submitted')

    def create(self, validated_data):
        user = self.context['request'].user
        if FirstQuestionnaire.objects.filter(user=user).exists():
            raise serializers.ValidationError('You have already submitted the questionnaire.')
        return FirstQuestionnaire.objects.create(**validated_data, user=user)
    

class FinalQuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalQuestionnaire
        fields = '__all__'
        read_only_fields = ('user', 'date_submitted')

    def create(self, validated_data):
        user = self.context['request'].user
        if FinalQuestionnaire.objects.filter(user=user).exists():
            raise serializers.ValidationError('You have already submitted the questionnaire.')
        return FinalQuestionnaire.objects.create(**validated_data, user=user)

class AudioAnalysisSerializer(serializers.Serializer):
    audio = serializers.FileField()
    sentence_id = serializers.IntegerField()
    audio_mimetype = serializers.CharField()


class StudySentencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudySentences
        fields = '__all__'
        read_only_fields = ('id', )


class StudySentencesCourseAssignmentSerializer(serializers.ModelSerializer):
    sentence_as_text = StudySentencesSerializer(source='sentence', read_only=True)
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = StudySentencesCourseAssignment
        fields = ('id', 'course', 'sentence', 'location_value', 'sentence_as_text', 'is_completed')
        read_only_fields = ('id', 'course', 'sentence', 'location_value', 'sentence_as_text', 'is_completed')
    
    def get_is_completed(self, obj):
        user = self.context['request'].user
        
        completed = PronunciationAssessmentResult.objects.filter(
            user=user, 
            sentence=obj.sentence,
            completeness__gt=25
        ).exists()
        return completed
    
class SynthSpeechLogSerializer(serializers.ModelSerializer):
    sentence = serializers.PrimaryKeyRelatedField(queryset=StudySentences.objects.all())

    class Meta:
        model = SynthSpeechLog
        fields = '__all__'
        read_only_fields = ('user', 'time')

    def validate(self, data):
        # Inject the user from the request context
        data['user'] = self.context['request'].user
        return data
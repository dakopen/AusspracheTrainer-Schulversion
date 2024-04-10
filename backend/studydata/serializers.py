from rest_framework import serializers
from .models import FirstQuestionnaire

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

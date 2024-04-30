from rest_framework import serializers
from .models import StandardToDo, UserToDo, ToDoDates

class StandardToDoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StandardToDo
        fields = '__all__'
        read_only_fields = [field.name for field in StandardToDo._meta.fields]


class UserToDoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserToDo
        fields = '__all__'
        read_only_fields = [field.name for field in UserToDo._meta.fields]


class ToDoDatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToDoDates
        fields = ['activation_date', 'due_date', 'standard_todo']

from django.contrib import admin
from .models import StandardToDo, ToDoDates, UserToDo

class StandardToDoAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'priority', 'action_relative_link')
    fields = ('title', 'description', 'priority', 'action_relative_link')
    search_fields = ('title', 'description')

class ToDoDatesAdmin(admin.ModelAdmin):
    list_display = ('course', 'standard_todo', 'due_date', 'activation_date', 'sent_reminder')
    fields = ('course', 'standard_todo', 'due_date', 'activation_date', 'sent_reminder')
    list_filter = ('course', 'standard_todo', 'due_date', 'activation_date')
    search_fields = ('course__name', 'standard_todo__title')

class UserToDoAdmin(admin.ModelAdmin):
    list_display = ('user', 'todo_date', 'completed', 'completion_date')
    fields = ('user', 'todo_date', 'completed', 'completion_date')
    list_filter = ('user', 'todo_date', 'completed')
    search_fields = ('user__username', 'todo_date__standard_todo__title')

admin.site.register(StandardToDo, StandardToDoAdmin)
admin.site.register(ToDoDates, ToDoDatesAdmin)
admin.site.register(UserToDo, UserToDoAdmin)

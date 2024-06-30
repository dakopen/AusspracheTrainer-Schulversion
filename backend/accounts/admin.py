from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import School, Course, User, ChangedUsernames

class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'short_id', 'english_since_grade', 'french_since_grade')

class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'grade', 'language', 'teacher', 'start_date', 'study_started', 'activate_final_test', 'scheduled_study_start', 'scheduled_final_test', 'created_at', 'demo')
    fields = ('name', 'grade', 'teacher', 'start_date', 'study_started', 'activate_final_test', 'scheduled_study_start', 'scheduled_final_test', 'demo')
    list_filter = ('language', 'grade', 'study_started', 'activate_final_test', 'demo')
    search_fields = ('name', 'teacher__username')  # Allow search by teacher's username

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'role', 'school', 'belongs_to_course', 'language', 'full_access_group')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Permissions', {'fields': ('role', 'school', 'belongs_to_course', 'language', 'full_access_group')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )
    search_fields = ('username', 'email')  # Include email in search fields
    ordering = ('username',)
    filter_horizontal = ()

class ChangedUsernamesAdmin(admin.ModelAdmin):
    list_display = ('user', 'old_username', 'new_username', 'created_at')
    exclude = ('email',)  # Exclude email if present in model fields, adjust if needed

# Register the models with their corresponding custom admin classes
admin.site.register(School, SchoolAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(ChangedUsernames, ChangedUsernamesAdmin)

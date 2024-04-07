from django.urls import path
from . import views

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('create-teacher/', views.CreateTeacherView.as_view(), name='create-teacher'),
    path('set-password/', views.SetPasswordView.as_view(), name='set-password'),
    path('create-any-role/', views.CreateAnyRoleView.as_view(), name='create-any-role'),
    path('schools/', views.SchoolListView.as_view(), name='school-list'),
    path('schools/create/', views.SchoolCreateView.as_view(), name='school-create'),
    path('courses/', views.CourseListView.as_view(), name='course-list'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('courses/create/', views.CourseCreateView.as_view(), name='course-create'),
    path('courses/<int:pk>/students', views.CourseStudentListView.as_view(), name='course-student-list'),
    path('courses/<int:pk>/students/bulkcreate', views.BulkCreateStudyStudentsView.as_view(), name='course-student-bulkcreate'),
]
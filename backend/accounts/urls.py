from django.urls import path
from . import views

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('create-teacher/', views.CreateTeacherView.as_view(), name='create-teacher'),
    path('set-password/', views.SetPasswordView.as_view(), name='set-password'),
    path('create-any-role/', views.CreateAnyRoleView.as_view(), name='create-any-role'),
    path('schools/', views.SchoolListView.as_view(), name='school-list'),
    path('schools/create/', views.SchoolCreateView.as_view(), name='school-create'),
]
from django.urls import path
from . import views

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('create-teacher/', views.CreateUserView.as_view(), name='create_teacher'),
    path('set-password/', views.SetPasswordView.as_view(), name='set-password'),
]
from django.urls import path
from . import views

urlpatterns = [
    path('', views.SingleUserToDoView.as_view(), name='user-todo'),
    path('all/', views.UserToDoView.as_view(), name='user-todos'),
    path('courses/<int:course_id>/todo-dates/', views.ToDoDatesView.as_view(), name='todo-dates'),
    path('courses/<int:course_id>/todo-dates/<int:standard_todo>/update', views.ToDoDatesView.as_view(), name='update-todo-date'),
]

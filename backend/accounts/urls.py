from django.urls import path
from . import views

urlpatterns = [
    path('health-check/', views.HealthCheckView.as_view(), name='health-check'),

    path('hello-world/', views.hello_world, name='hello_world'),
    path('create-teacher', views.CreateTeacherView.as_view(), name='create-teacher'),  # überarbeiten
    path('set-password/', views.SetPasswordView.as_view(), name='set-password'),
    path('create-any-role', views.CreateAnyRoleView.as_view(), name='create-any-role'),  # überarbeiten
    path('submit-studystudent-email/', views.SubmitStudyStudentEmailView.as_view(), name='submit-studystudent-email'),

    path('delete-account/', views.RequestDeleteAccountView.as_view(), name='delete-account'),
    path('delete-account/confirm/<str:uidb64>/<str:token>/', views.DeleteAccountConfirmView.as_view(), name='delete_account_confirm'),
    path('change-username/', views.ChangeUsernameView.as_view(), name='change-username'),

    path('forgot-username/', views.ForgotUsernameView.as_view(), name='forgot-username'),
    path('request-reset-password/', views.PasswordResetRequestView.as_view(), name='request-reset-password'),
    path('reset-password/<uidb64>/<token>/', views.PasswordResetView.as_view(), name='reset-password'),
    path('check-finished-study-and-downloaded-report/', views.CheckUserFinishedStudyAndDownloadedReport.as_view(), name='check-user-finished-study-and-downloaded-report'),
    path('mark-user-report-as-downloaded/', views.MarkUserReportAsDownloadedView.as_view(), name='mark-user-report-as-downloaded'),

    path('schools/', views.SchoolListView.as_view(), name='school-list'),
    path('schools/create', views.SchoolCreateView.as_view(), name='school-create'),
    path('schools/<int:pk>/', views.SchoolDetailView.as_view(), name='school-detail'),
    path('schools/<int:pk>/teachers/', views.SchoolTeacherListView.as_view(), name='school-teacher-list'),
    path('schools/<int:pk>/secretaries/', views.SchoolSecretaryListView.as_view(), name='school-secretary-list'),
    
    path('courses/', views.CourseListView.as_view(), name='course-list'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('courses/create', views.CourseCreateView.as_view(), name='course-create'),
    path('courses/<int:pk>/students/', views.CourseStudentListView.as_view(), name='course-student-list'),
    path('courses/<int:pk>/students/bulkcreate', views.BulkCreateStudyStudentsView.as_view(), name='course-student-bulkcreate'),
    path('courses/<int:pk>/update', views.CourseUpdateView.as_view(), name='course-update'),
    path('courses/<int:course_id>/changed_usernames/', views.CourseChangedUsernamesView.as_view(), name='course_changed_usernames'),
    path('courses/<int:course_id>/generate_usernames_pdf/', views.GenerateAndDownloadPDFView.as_view(), name='generate_usernames_pdf'),
]
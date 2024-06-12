from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('t/admin/', admin.site.urls),
    path('t/accounts/', include('accounts.urls')),
    path('t/api/', include('accounts.api.urls')),
    path('t/studydata/', include('studydata.urls')),
    path('t/todo/', include('todo.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('api/', include('accounts.api.urls')),
    path('studydata/', include('studydata.urls')),
    path('todo/', include('todo.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

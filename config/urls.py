from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([AllowAny])
def api_home(request):
    return Response({"message": "Welcome to SkillVerse AI 🚀"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api_home, name="api_home"),
    path("api/auth/", include("accounts.urls")),
    path("api/resume/", include("resume_api.urls")),
    path("api/interview/", include("interviews.urls")),
    path("", include("core.urls")),
    path("admin-panel/", include("admin_app.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

handler404 = "core.views.custom_404"

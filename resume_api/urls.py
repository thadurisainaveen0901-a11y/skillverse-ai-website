from django.urls import path
from . import views

urlpatterns = [
    path("analyze", views.analyze_resume_view, name="resume_analyze"),
    path("roles", views.get_roles_view, name="resume_roles"),
]

from django.urls import path
from . import views

urlpatterns = [
    path("", views.admin_login, name="admin_login"),
    path("logout/", views.admin_logout, name="admin_logout"),
    path("dashboard/", views.admin_dashboard, name="admin_dashboard"),
    path("users/", views.admin_users, name="admin_users"),
    path("interviews/", views.admin_interviews, name="admin_interviews"),
    path("settings/", views.admin_settings, name="admin_settings"),
]

from django.urls import path
from . import views

urlpatterns = [
    path("register", views.register_view, name="register_api"),
    path("login", views.login_view, name="login_api"),
    path("logout", views.logout_view, name="logout"),
    path("me", views.profile_view, name="profile"),
    path("csrf", views.csrf_token_view, name="csrf_token"),
]

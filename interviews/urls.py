from django.urls import path
from . import views

urlpatterns = [
    path("start", views.start_interview, name="interview_start"),
    path("evaluate", views.evaluate_answer_view, name="interview_evaluate"),
    path("summary", views.summary_view, name="interview_summary"),
    path("history", views.history_view, name="interview_history"),
    path("stats", views.stats_view, name="interview_stats"),
]

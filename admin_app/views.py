from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.db.models import Count, Avg
from interviews.models import Interview


def admin_login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_staff:
            login(request, user)
            return redirect("admin_dashboard")
        else:
            messages.error(request, "Invalid admin credentials")
    return render(request, "admin_app/login.html")


def admin_logout(request):
    logout(request)
    return redirect("admin_login")


def admin_dashboard(request):
    if not request.user.is_staff:
        return redirect("admin_login")
    total_users = User.objects.count()
    total_interviews = Interview.objects.count()
    avg_score = Interview.objects.aggregate(Avg("score"))["score__avg"] or 0
    recent_users = User.objects.order_by("-date_joined")[:10]
    recent_interviews = Interview.objects.order_by("-created_at")[:10]
    context = {
        "total_users": total_users,
        "total_interviews": total_interviews,
        "avg_score": round(avg_score, 1),
        "recent_users": recent_users,
        "recent_interviews": recent_interviews,
    }
    return render(request, "admin_app/dashboard.html", context)


def admin_users(request):
    if not request.user.is_staff:
        return redirect("admin_login")
    users = User.objects.all().order_by("-date_joined")
    return render(request, "admin_app/users.html", {"users": users})


def admin_interviews(request):
    if not request.user.is_staff:
        return redirect("admin_login")
    interviews = Interview.objects.all().order_by("-created_at")
    return render(request, "admin_app/interviews.html", {"interviews": interviews})


def admin_settings(request):
    if not request.user.is_staff:
        return redirect("admin_login")
    return render(request, "admin_app/settings.html")

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
import json


@require_http_methods(["GET", "POST"])
def register_view(request):
    """Handle user registration."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username", "").strip()
            email = data.get("email", "").strip()
            password = data.get("password", "")
            full_name = data.get("full_name", "").strip()

            if not username or not email or not password:
                return JsonResponse({"error": "All fields are required"}, status=400)

            if len(password) < 6:
                return JsonResponse({"error": "Password must be at least 6 characters"}, status=400)

            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=full_name
            )

            login(request, user)

            return JsonResponse({
                "message": "Registration successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                }
            })
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return render(request, "core/register.html")


@require_http_methods(["GET", "POST"])
def login_view(request):
    """Handle user login."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username", "").strip()
            password = data.get("password", "")

            if not username or not password:
                return JsonResponse({"error": "Username and password are required"}, status=400)

            user = authenticate(request, username=username, password=password)

            if user is None and "@" in username:
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(request, username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass

            if user is not None:
                login(request, user)
                return JsonResponse({
                    "message": "Login successful",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                    }
                })
            else:
                return JsonResponse({"error": "Invalid username or password"}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return render(request, "core/login.html")


def logout_view(request):
    """Logout user."""
    logout(request)
    return redirect("home")


def profile_view(request):
    """Get current user profile."""
    if request.user.is_authenticated:
        return JsonResponse({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
        })
    return JsonResponse({"error": "Not authenticated"}, status=401)


def csrf_token_view(request):
    """Get CSRF token for API requests."""
    return JsonResponse({"csrfToken": get_token(request)})

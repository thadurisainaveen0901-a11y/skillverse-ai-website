from django.shortcuts import render

def home(request):
    return render(request, "core/home.html")

def login(request):
    return render(request, "core/login.html")

def register(request):
    return render(request, "core/register.html")

def dashboard(request):
    return render(request, "core/dashboard.html")

def resume(request):
    return render(request, "core/resume.html")

def interview(request):
    return render(request, "core/interview.html")

def profile(request):
    return render(request, "core/profile.html")

def settings(request):
    return render(request, "core/settings.html")

def api_docs(request):
    return render(request, "core/api_docs.html")

def about(request):
    return render(request, "core/about.html")

def features(request):
    return render(request, "core/features.html")

def contact(request):
    return render(request, "core/contact.html")

def help_center(request):
    return render(request, "core/help_center.html")

def privacy(request):
    return render(request, "core/privacy.html")

def terms(request):
    return render(request, "core/terms.html")

def careers(request):
    return render(request, "core/careers.html")

def blog(request):
    return render(request, "core/blog.html")

def press(request):
    return render(request, "core/press.html")

def job_tracker(request):
    return render(request, "core/job_tracker.html")

def cover_letter(request):
    return render(request, "core/cover_letter.html")

def linkedin_optimizer(request):
    return render(request, "core/linkedin_optimizer.html")

def skill_challenges(request):
    return render(request, "core/skill_challenges.html")

def resume_templates(request):
    return render(request, "core/resume_templates.html")

def salary_insights(request):
    return render(request, "core/salary_insights.html")

def company_prep(request):
    return render(request, "core/company_prep.html")

def ai_mentor(request):
    return render(request, "core/ai_mentor.html")

def voice_interview(request):
    return render(request, "core/voice_interview.html")


def custom_404(request, exception):
    return render(request, "core/404.html", status=404)

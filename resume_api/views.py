from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .services.resume_service import analyze_resume
from .services.job_roles import get_all_roles


@api_view(["POST"])
@permission_classes([AllowAny])
def analyze_resume_view(request):
    """Upload and analyze a resume file."""
    if "resume" not in request.FILES:
        return Response({"error": "No resume file provided"}, status=400)

    resume_file = request.FILES["resume"]
    role = request.data.get("role", "general")

    # Validate file type
    allowed_extensions = [".pdf", ".docx", ".txt"]
    if not any(resume_file.name.lower().endswith(ext) for ext in allowed_extensions):
        return Response({"error": "Invalid file type. Upload PDF, DOCX, or TXT."}, status=400)

    # Validate file size (10MB max)
    if resume_file.size > 10 * 1024 * 1024:
        return Response({"error": "File too large. Maximum 10MB allowed."}, status=400)

    result = analyze_resume(resume_file, role)

    if "error" in result:
        return Response(result, status=400)

    return Response(result)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_roles_view(request):
    """Get all available job roles."""
    return Response(get_all_roles())

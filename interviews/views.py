from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .services import get_questions, evaluate_answer


@api_view(["GET"])
@permission_classes([AllowAny])
def start_interview(request):
    """Start a new interview session with questions for a role."""
    role = request.GET.get("role", "general")
    count = int(request.GET.get("count", 5))

    questions = get_questions(role, count)

    return Response({
        "session_id": f"session_{role}",
        "questions": questions,
        "role": role,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def evaluate_answer_view(request):
    """Evaluate an interview answer."""
    question = request.data.get("question", "")
    answer = request.data.get("answer", "")
    role = request.data.get("role", "general")

    if not answer:
        return Response({"error": "No answer provided"}, status=400)

    result = evaluate_answer(answer, question, role)

    return Response(result)


@api_view(["POST"])
@permission_classes([AllowAny])
def summary_view(request):
    """Get interview session summary."""
    role = request.data.get("role", "general")
    answers = request.data.get("answers", [])

    if not answers:
        return Response({"error": "No answers provided"}, status=400)

    scores = [a.get("score", 0) for a in answers]
    avg_score = sum(scores) / len(scores) if scores else 0

    return Response({
        "role": role,
        "total_questions": len(answers),
        "average_score": round(avg_score, 1),
        "highest_score": max(scores) if scores else 0,
        "lowest_score": min(scores) if scores else 0,
        "overall_feedback": f"You scored an average of {avg_score:.1f}/10 across {len(answers)} questions.",
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def history_view(request):
    """Get user's interview history."""
    return Response([])


@api_view(["GET"])
@permission_classes([AllowAny])
def stats_view(request):
    """Get user's interview statistics."""
    return Response({
        "total_interviews": 0,
        "average_score": 0,
        "highest_score": 0,
        "lowest_score": 0,
    })

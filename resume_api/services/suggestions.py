"""Resume improvement suggestions service."""

from typing import Dict, List


def generate_suggestions(parsed_data: Dict, ats_score: int, missing_keywords: List[str]) -> List[str]:
    """Generate personalized improvement suggestions."""
    suggestions = []

    if not parsed_data.get('phone'):
        suggestions.append("Add your phone number for complete contact info")

    if not parsed_data.get('linkedin'):
        suggestions.append("Include your LinkedIn profile URL")

    if not parsed_data.get('github'):
        suggestions.append("Add your GitHub profile to showcase your code")

    skills = parsed_data.get('skills', [])
    if len(skills) < 5:
        suggestions.append("Add more technical skills relevant to your target role")

    if not parsed_data.get('education'):
        suggestions.append("Include your education details")

    if not parsed_data.get('experience'):
        suggestions.append("Add internships or work experience")
    elif len(parsed_data.get('experience', '')) < 100:
        suggestions.append("Expand your work experience with more details")

    if not parsed_data.get('projects'):
        suggestions.append("Add 2-3 strong projects showcasing your skills")
    elif len(parsed_data.get('projects', '')) < 100:
        suggestions.append("Provide more detail about your projects")

    if not parsed_data.get('certifications'):
        suggestions.append("Add relevant certifications to stand out")

    if missing_keywords:
        suggestions.append(f"Consider learning: {', '.join(missing_keywords[:3])}")

    if ats_score < 50:
        suggestions.append("Focus on adding more details to all sections")
    elif ats_score < 70:
        suggestions.append("Good start! Add more specifics to improve your score")

    if not suggestions:
        suggestions.append("Great job! Your resume is well-optimized")

    return suggestions

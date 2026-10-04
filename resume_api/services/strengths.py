"""Resume strengths identification service."""

from typing import Dict, List


def identify_strengths(parsed_data: Dict, ats_score: int) -> List[str]:
    """Identify resume strengths based on parsed data."""
    strengths = []

    if parsed_data.get('name') and parsed_data.get('email') and parsed_data.get('phone'):
        strengths.append("Complete contact information")

    if parsed_data.get('linkedin'):
        strengths.append("LinkedIn profile included")

    if parsed_data.get('github'):
        strengths.append("GitHub profile included")

    skills = parsed_data.get('skills', [])
    if len(skills) >= 5:
        strengths.append("Strong technical skills section")
    elif len(skills) >= 3:
        strengths.append("Good technical skills listed")

    if parsed_data.get('education'):
        strengths.append("Education section present")

    if parsed_data.get('experience'):
        exp = parsed_data.get('experience', '')
        if len(exp) > 100:
            strengths.append("Detailed work experience")
        else:
            strengths.append("Work experience included")

    if parsed_data.get('projects'):
        proj = parsed_data.get('projects', '')
        if len(proj) > 100:
            strengths.append("Strong project portfolio")
        else:
            strengths.append("Projects section present")

    if parsed_data.get('certifications'):
        strengths.append("Professional certifications included")

    if ats_score >= 80:
        strengths.append("Excellent ATS compatibility")
    elif ats_score >= 60:
        strengths.append("Good ATS compatibility")

    if not strengths:
        strengths.append("Resume submitted for analysis")

    return strengths

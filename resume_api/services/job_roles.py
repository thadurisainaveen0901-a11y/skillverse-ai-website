"""Job role definitions and keyword matching."""

from typing import Dict, List


JOB_ROLES = {
    "python_developer": {
        "name": "Python Developer",
        "keywords": ["Python", "Django", "Flask", "FastAPI", "SQL", "Git", "Docker", "AWS", "REST", "API"],
    },
    "javascript_developer": {
        "name": "JavaScript Developer",
        "keywords": ["JavaScript", "React", "Node.js", "Express", "MongoDB", "Git", "HTML", "CSS", "TypeScript", "Redux"],
    },
    "data_scientist": {
        "name": "Data Scientist",
        "keywords": ["Python", "SQL", "Machine Learning", "Pandas", "NumPy", "TensorFlow", "Power BI", "Excel", "Statistics", "R"],
    },
    "devops_engineer": {
        "name": "DevOps Engineer",
        "keywords": ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Terraform", "Linux", "Python", "Bash", "Git"],
    },
    "fullstack_developer": {
        "name": "Full Stack Developer",
        "keywords": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "Git", "SQL", "REST"],
    },
}


def get_role_keywords(role: str) -> List[str]:
    """Get keywords for a specific role."""
    role_data = JOB_ROLES.get(role, {})
    return role_data.get("keywords", [])


def get_all_roles() -> List[Dict]:
    """Get all available job roles."""
    return [{"id": k, "name": v["name"], "keywords": v["keywords"]} for k, v in JOB_ROLES.items()]


def match_skills(user_skills: List[str], role: str) -> Dict:
    """Match user skills against role keywords."""
    required = get_role_keywords(role)
    user_skills_lower = [s.lower() for s in user_skills]

    matched = []
    missing = []

    for keyword in required:
        keyword_lower = keyword.lower()
        found = any(keyword_lower in us or us in keyword_lower for us in user_skills_lower)
        if found:
            matched.append(keyword)
        else:
            missing.append(keyword)

    match_percentage = int((len(matched) / len(required)) * 100) if required else 0

    return {
        "matched": matched,
        "missing": missing,
        "match_percentage": match_percentage,
    }

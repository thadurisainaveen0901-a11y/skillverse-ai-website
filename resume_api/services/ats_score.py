"""ATS scoring service."""

from typing import Dict, List


class ATSScorer:
    """Calculate ATS compatibility score for resumes."""

    def __init__(self, parsed_data: Dict, target_role: str = ""):
        self.data = parsed_data
        self.target_role = target_role

    def score_contact(self) -> int:
        """Score contact information (max 15)."""
        score = 0
        if self.data.get('name'):
            score += 5
        if self.data.get('email'):
            score += 5
        if self.data.get('phone'):
            score += 5
        return score

    def score_skills(self) -> int:
        """Score technical skills (max 20)."""
        skills = self.data.get('skills', [])
        return min(len(skills) * 2, 20)

    def score_education(self) -> int:
        """Score education section (max 15)."""
        return 15 if self.data.get('education') else 0

    def score_experience(self) -> int:
        """Score work experience (max 20)."""
        exp = self.data.get('experience', '')
        if not exp:
            return 0
        score = 10
        if len(exp) > 50:
            score += 5
        if len(exp) > 100:
            score += 5
        return score

    def score_projects(self) -> int:
        """Score projects section (max 20)."""
        proj = self.data.get('projects', '')
        if not proj:
            return 0
        score = 10
        if len(proj) > 50:
            score += 5
        if len(proj) > 100:
            score += 5
        return score

    def score_links(self) -> int:
        """Score LinkedIn/GitHub links (max 10)."""
        score = 0
        if self.data.get('linkedin'):
            score += 5
        if self.data.get('github'):
            score += 5
        return score

    def calculate_total(self) -> int:
        """Calculate total ATS score."""
        return (
            self.score_contact() +
            self.score_skills() +
            self.score_education() +
            self.score_experience() +
            self.score_projects() +
            self.score_links()
        )

    def get_breakdown(self) -> Dict:
        """Get score breakdown by category."""
        return {
            'contact_score': self.score_contact(),
            'skills_score': self.score_skills(),
            'education_score': self.score_education(),
            'experience_score': self.score_experience(),
            'projects_score': self.score_projects(),
            'links_score': self.score_links(),
        }

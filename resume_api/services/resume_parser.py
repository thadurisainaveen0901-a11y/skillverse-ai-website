"""Resume text extraction and parsing service."""

import re
from typing import Dict, List, Optional


class ResumeParser:
    """Parse resume text and extract structured information."""

    def __init__(self, text: str):
        self.text = text
        self.lines = text.split('\n')

    def extract_name(self) -> str:
        """Extract candidate name from resume."""
        for line in self.lines[:10]:
            line = line.strip()
            if line and len(line) > 2 and len(line) < 50:
                if not any(x in line.lower() for x in ['resume', 'cv', 'curriculum', 'email', 'phone', 'tel', 'address']):
                    return line
        return ""

    def extract_email(self) -> str:
        """Extract email address."""
        pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        match = re.search(pattern, self.text)
        return match.group(0) if match else ""

    def extract_phone(self) -> str:
        """Extract phone number."""
        patterns = [
            r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
            r'\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}',
        ]
        for pattern in patterns:
            match = re.search(pattern, self.text)
            if match:
                return match.group(0)
        return ""

    def extract_linkedin(self) -> str:
        """Extract LinkedIn URL."""
        pattern = r'(https?://)?(www\.)?linkedin\.com/in/[a-zA-Z0-9-]+'
        match = re.search(pattern, self.text)
        return match.group(0) if match else ""

    def extract_github(self) -> str:
        """Extract GitHub URL."""
        pattern = r'(https?://)?(www\.)?github\.com/[a-zA-Z0-9-]+'
        match = re.search(pattern, self.text)
        return match.group(0) if match else ""

    def extract_skills(self) -> List[str]:
        """Extract technical skills from resume."""
        skill_keywords = [
            'Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue',
            'FastAPI', 'Flask', 'Django', 'Node.js', 'Express', 'SQL', 'MySQL', 'PostgreSQL',
            'MongoDB', 'Git', 'GitHub', 'Docker', 'AWS', 'HTML', 'CSS', 'Tailwind',
            'Power BI', 'Excel', 'Machine Learning', 'AI', 'TensorFlow', 'Pandas', 'NumPy',
            'Kubernetes', 'Jenkins', 'Terraform', 'Linux', 'REST', 'API', 'GraphQL',
            'Redis', 'Kafka', 'RabbitMQ', 'Elasticsearch', 'Docker', 'CI/CD', 'Agile', 'Scrum'
        ]
        found_skills = []
        text_lower = self.text.lower()
        for skill in skill_keywords:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        return found_skills

    def extract_education(self) -> str:
        """Extract education information."""
        education_keywords = ['B.Tech', 'B.E', 'M.Tech', 'M.E', 'B.Sc', 'M.Sc', 'BCA', 'MCA', 'MBA', 'PhD', 'University', 'Institute', 'College']
        for line in self.lines:
            line_lower = line.lower()
            if any(kw.lower() in line_lower for kw in education_keywords):
                return line.strip()
        return ""

    def extract_experience(self) -> str:
        """Extract work experience."""
        exp_keywords = ['experience', 'worked', 'intern', 'developer', 'engineer', 'manager', 'analyst', 'consultant']
        for line in self.lines:
            line_lower = line.lower()
            if any(kw in line_lower for kw in exp_keywords):
                return line.strip()
        return ""

    def extract_projects(self) -> str:
        """Extract project information."""
        proj_keywords = ['project', 'built', 'developed', 'created', 'designed', 'implemented']
        for line in self.lines:
            line_lower = line.lower()
            if any(kw in line_lower for kw in proj_keywords):
                return line.strip()
        return ""

    def extract_certifications(self) -> str:
        """Extract certifications."""
        cert_keywords = ['certification', 'certified', 'course', 'training', 'diploma']
        for line in self.lines:
            line_lower = line.lower()
            if any(kw in line_lower for kw in cert_keywords):
                return line.strip()
        return ""

    def get_word_count(self) -> int:
        """Get total word count."""
        return len(self.text.split())

    def parse(self) -> Dict:
        """Parse resume and return structured data."""
        return {
            'name': self.extract_name(),
            'email': self.extract_email(),
            'phone': self.extract_phone(),
            'linkedin': self.extract_linkedin(),
            'github': self.extract_github(),
            'skills': self.extract_skills(),
            'education': self.extract_education(),
            'experience': self.extract_experience(),
            'projects': self.extract_projects(),
            'certifications': self.extract_certifications(),
            'word_count': self.get_word_count(),
        }

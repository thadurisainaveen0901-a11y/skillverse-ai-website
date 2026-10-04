"""Main resume analysis service."""

import io
import re
from typing import Dict, List

from .resume_parser import ResumeParser
from .ats_score import ATSScorer
from .job_roles import match_skills, get_all_roles
from .strengths import identify_strengths
from .suggestions import generate_suggestions


def extract_text_from_file(file) -> str:
    """Extract text from uploaded file (PDF, DOCX, TXT)."""
    filename = file.name.lower()

    if filename.endswith('.txt'):
        return file.read().decode('utf-8', errors='ignore')

    elif filename.endswith('.docx'):
        try:
            from docx import Document
            doc = Document(io.BytesIO(file.read()))
            return '\n'.join([para.text for para in doc.paragraphs])
        except ImportError:
            return "Error: python-docx not installed. Install with: pip install python-docx"

    elif filename.endswith('.pdf'):
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(stream=file.read(), filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except ImportError:
            return "Error: PyMuPDF not installed. Install with: pip install PyMuPDF"

    else:
        return "Error: Unsupported file format. Please upload PDF, DOCX, or TXT."


def analyze_resume(file, role: str = "general") -> Dict:
    """Complete resume analysis pipeline."""
    # Extract text
    text = extract_text_from_file(file)

    if text.startswith("Error:"):
        return {"error": text}

    # Parse resume
    parser = ResumeParser(text)
    parsed_data = parser.parse()

    # Calculate ATS score
    scorer = ATSScorer(parsed_data, role)
    ats_score = scorer.calculate_total()
    breakdown = scorer.get_breakdown()

    # Match skills
    skill_match = match_skills(parsed_data.get('skills', []), role)

    # Identify strengths
    strengths = identify_strengths(parsed_data, ats_score)

    # Generate suggestions
    suggestions = generate_suggestions(parsed_data, ats_score, skill_match.get('missing', []))

    return {
        "ats_score": ats_score,
        "contact_score": breakdown['contact_score'],
        "skills_score": breakdown['skills_score'],
        "education_score": breakdown['education_score'],
        "experience_score": breakdown['experience_score'],
        "projects_score": breakdown['projects_score'],
        "links_score": breakdown['links_score'],
        "keywords_matched": skill_match['matched'],
        "keywords_total": len(skill_match['matched']) + len(skill_match['missing']),
        "skills_found": len(parsed_data.get('skills', [])),
        "word_count": parsed_data.get('word_count', 0),
        "strengths": strengths,
        "suggestions": suggestions,
        "missing_keywords": skill_match['missing'],
        "match_percentage": skill_match['match_percentage'],
    }

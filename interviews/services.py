"""Interview question banks and answer evaluation service."""

import random
from typing import Dict, List


QUESTION_BANKS = {
    "python_developer": [
        "Explain the difference between a list and a tuple in Python.",
        "What is a decorator in Python? Provide an example.",
        "How does Python handle memory management?",
        "Explain the GIL (Global Interpreter Lock) in Python.",
        "What are Python generators and how are they different from iterators?",
        "Explain the difference between shallow copy and deep copy.",
        "What is the difference between @staticmethod and @classmethod?",
        "How do you handle exceptions in Python?",
        "Explain the concept of closures in Python.",
        "What is the difference between __str__ and __repr__?",
    ],
    "javascript_developer": [
        "Explain the difference between let, const, and var.",
        "What is the event loop in JavaScript?",
        "Explain closures in JavaScript with an example.",
        "What is the difference between == and === in JavaScript?",
        "How does prototypal inheritance work in JavaScript?",
        "Explain the concept of hoisting in JavaScript.",
        "What is the difference between call, apply, and bind?",
        "Explain promises and async/await in JavaScript.",
        "What is the difference between null and undefined?",
        "Explain the concept of scope in JavaScript.",
    ],
    "data_scientist": [
        "What is the difference between supervised and unsupervised learning?",
        "Explain the bias-variance tradeoff.",
        "How do you handle missing data in a dataset?",
        "What is cross-validation and why is it important?",
        "Explain the difference between L1 and L2 regularization.",
        "What is the difference between classification and regression?",
        "Explain the concept of overfitting and how to prevent it.",
        "What is the difference between bagging and boosting?",
        "Explain the ROC curve and AUC score.",
        "What is the difference between precision and recall?",
    ],
    "devops_engineer": [
        "What is CI/CD and why is it important?",
        "Explain the difference between Docker and Kubernetes.",
        "What is Infrastructure as Code (IaC)?",
        "How do you monitor a production system?",
        "Explain blue-green deployment strategy.",
        "What is the difference between horizontal and vertical scaling?",
        "Explain the concept of microservices architecture.",
        "What is the difference between TCP and UDP?",
        "Explain the OSI model layers.",
        "What is the difference between stateful and stateless applications?",
    ],
    "fullstack_developer": [
        "Explain the difference between SQL and NoSQL databases.",
        "What is RESTful API design?",
        "How do you handle authentication in a web application?",
        "Explain the concept of middleware in web frameworks.",
        "What is the difference between server-side and client-side rendering?",
        "Explain the difference between cookies, local storage, and session storage.",
        "What is CORS and why is it important?",
        "Explain the difference between GET and POST requests.",
        "What is the difference between React and Angular?",
        "Explain the concept of component lifecycle in React.",
    ],
    "general": [
        "Tell me about yourself and your background.",
        "What are your greatest strengths and weaknesses?",
        "Why do you want to work at our company?",
        "Describe a challenging project you worked on.",
        "Where do you see yourself in 5 years?",
        "How do you handle pressure and tight deadlines?",
        "Describe a time when you had to work in a team.",
        "What is your greatest professional achievement?",
        "How do you stay updated with industry trends?",
        "Do you have any questions for us?",
    ],
}


def get_questions(role: str, count: int = 5) -> List[str]:
    """Get random questions for a specific role."""
    bank = QUESTION_BANKS.get(role, QUESTION_BANKS["general"])
    count = min(count, len(bank))
    return random.sample(bank, count)


def evaluate_answer(answer: str, question: str, role: str) -> Dict:
    """Evaluate an interview answer and provide feedback."""
    word_count = len(answer.split())
    has_examples = bool(answer and any(x in answer.lower() for x in ['for example', 'such as', 'like', 'instance']))
    has_technical = bool(answer and any(x in answer.lower() for x in ['function', 'class', 'method', 'variable', 'object', 'array', 'api', 'database', 'framework', 'algorithm', 'data', 'system', 'process']))
    has_structure = bool(answer and any(x in answer.lower() for x in ['first', 'second', 'then', 'finally', 'because', 'therefore', 'however', 'additionally', 'moreover']))
    has_numbers = bool(answer and any(x in answer.lower() for x in ['%', 'percent', 'x', 'times', 'increased', 'decreased', 'improved', 'reduced']))

    # Calculate score
    score = 3
    if word_count > 20:
        score += 1
    if word_count > 50:
        score += 1
    if word_count > 100:
        score += 1
    if has_examples:
        score += 1
    if has_technical:
        score += 1
    if has_structure:
        score += 1
    if has_numbers:
        score += 1
    score = min(score, 10)

    # Generate feedback
    feedback_parts = []
    feedback_parts.append(f"<p><strong>Answer Analysis:</strong></p>")
    feedback_parts.append(f"<p>Your answer contains <strong>{word_count} words</strong>.</p>")

    if word_count < 20:
        feedback_parts.append("<p>Your answer is quite brief. Try to elaborate more with specific examples and technical details.</p>")
    elif word_count < 50:
        feedback_parts.append("<p>Good length! Consider adding more specific examples to strengthen your answer.</p>")
    else:
        feedback_parts.append("<p>Excellent detail! Your answer demonstrates depth of knowledge.</p>")

    if has_examples:
        feedback_parts.append("<p>Great use of examples! This makes your answer more concrete.</p>")
    else:
        feedback_parts.append("<p>Tip: Add specific examples to make your answer more compelling.</p>")

    if has_technical:
        feedback_parts.append("<p>Good use of technical terminology relevant to the role.</p>")
    else:
        feedback_parts.append(f"<p>Tip: Include more technical terms related to {role.replace('_', ' ')}.</p>")

    if has_structure:
        feedback_parts.append("<p>Well-structured answer with clear logical flow.</p>")
    else:
        feedback_parts.append("<p>Tip: Structure your answer using frameworks like STAR (Situation, Task, Action, Result).</p>")

    if has_numbers:
        feedback_parts.append("<p>Excellent! Quantifying achievements makes your answer more impactful.</p>")

    return {
        "score": score,
        "feedback": "".join(feedback_parts),
        "strengths": _get_strengths(word_count, has_examples, has_technical, has_structure, has_numbers),
        "improvements": _get_improvements(word_count, has_examples, has_technical, has_structure, has_numbers),
    }


def _get_strengths(word_count, has_examples, has_technical, has_structure, has_numbers):
    strengths = []
    if word_count > 50:
        strengths.append("Detailed response")
    if has_examples:
        strengths.append("Good use of examples")
    if has_technical:
        strengths.append("Technical knowledge demonstrated")
    if has_structure:
        strengths.append("Well-structured answer")
    if has_numbers:
        strengths.append("Quantified achievements")
    return strengths


def _get_improvements(word_count, has_examples, has_technical, has_structure, has_numbers):
    improvements = []
    if word_count < 50:
        improvements.append("Provide more detail")
    if not has_examples:
        improvements.append("Add specific examples")
    if not has_technical:
        improvements.append("Use more technical terms")
    if not has_structure:
        improvements.append("Structure answer better")
    if not has_numbers:
        improvements.append("Quantify your achievements")
    return improvements

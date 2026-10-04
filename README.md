# SkillVerse AI

> **AI-powered placement and career preparation platform for students**

SkillVerse AI is a full-stack web application designed to help students
become **job-ready** from one platform. It combines authentication,
resume analysis, ATS scoring, job matching, AI-assisted interview
practice, interview history/statistics, and a modern React dashboard.

This README documents the **current project contained in this package**,
including the Django backend migration, React frontend, architecture,
features, API endpoints, setup commands, folder structure, data flow,
configuration, and known limitations.

------------------------------------------------------------------------

## 1. Project Overview

### Project Name

**SkillVerse AI**

### Main Purpose

The purpose of SkillVerse AI is to provide students with a centralized
platform for placement preparation.

Instead of using separate websites for resume checking, interview
practice, career preparation, and progress tracking, the project brings
the main preparation workflows into one application.

### Core Problem

Students commonly face problems such as:

-   Difficulty knowing whether a resume is ATS-friendly.
-   Lack of personalized resume feedback.
-   Difficulty comparing a resume with a target job role.
-   Lack of realistic technical interview practice.
-   No single place to track interview performance.
-   Difficulty identifying missing technical skills.
-   Need for a simple student-focused career preparation dashboard.

### Proposed Solution

SkillVerse AI provides:

1.  User registration and login.
2.  JWT-based authentication.
3.  Student dashboard.
4.  Resume upload and parsing.
5.  ATS-style resume scoring.
6.  Resume section analysis.
7.  Target-role skill matching.
8.  Job-description keyword matching.
9.  Resume strengths and suggestions.
10. Resume report generation.
11. Technical interview question generation.
12. Answer evaluation.
13. Optional OpenAI-powered answer evaluation.
14. Interview summary.
15. Interview history.
16. Interview statistics.

------------------------------------------------------------------------

# 2. Technology Stack

## Frontend

  Technology                   Purpose
  ---------------------------- -----------------------------------
  React 19                     User interface
  TypeScript                   Type-safe frontend development
  Vite                         Development server and build tool
  React Router                 Page routing
  Axios                        HTTP/API communication
  Framer Motion                UI animation
  React Icons                  Icons
  Chart.js                     Charts and analytics
  React Circular Progressbar   ATS score visualization
  jsPDF                        PDF report generation
  Tailwind CSS                 Utility styling
  React Toastify               Notifications

## Backend

  Technology              Purpose
  ----------------------- ----------------------------------
  Python 3.11+            Backend language
  Django 5.2              Web framework
  Django REST Framework   REST APIs
  Simple JWT              JWT authentication
  django-cors-headers     Frontend/backend CORS
  SQLite                  Development database
  PyMuPDF                 PDF resume extraction
  python-docx             DOCX resume extraction
  OpenAI SDK              Optional AI interview evaluation
  python-dotenv           Environment configuration

------------------------------------------------------------------------

# 3. Architecture

The current architecture is:

``` text
                    ┌─────────────────────────┐
                    │       React Frontend    │
                    │      TypeScript + Vite  │
                    └────────────┬────────────┘
                                 │
                           HTTP / REST API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Django Backend      │
                    │ Django REST Framework   │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        ┌───────────┐      ┌────────────┐     ┌─────────────┐
        │ Accounts  │      │ Resume API │     │ Interviews  │
        └─────┬─────┘      └──────┬─────┘     └──────┬──────┘
              │                   │                   │
              ▼                   ▼                   ▼
        Django User          Resume Services      Interview
        + JWT Auth           Parser/ATS/Match     Services
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  ▼
                         ┌────────────────┐
                         │ SQLite Database│
                         └────────────────┘

                     Optional
                         │
                         ▼
                    OpenAI API
              (AI interview evaluation)
```

------------------------------------------------------------------------

# 4. Project Structure

``` text
skillverse-ai/
│
├── backend/
│   │
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   ├── skillverse.db
│   ├── skillverse_fastapi_backup.db
│   │
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── accounts/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── user_urls.py
│   │   └── views.py
│   │
│   ├── resume_api/
│   │   ├── apps.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── services/
│   │       ├── ats_score.py
│   │       ├── job_description_matcher.py
│   │       ├── job_roles.py
│   │       ├── keyword_matcher.py
│   │       ├── resume_parser.py
│   │       ├── resume_reader.py
│   │       ├── resume_service.py
│   │       ├── strengths.py
│   │       └── suggestions.py
│   │
│   ├── interviews/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── services.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   └── migrations/
│   │
│   └── README_DJANGO.md
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   │
│   ├── public/
│   │
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       │
│       ├── api/
│       │   ├── auth.ts
│       │   ├── interview.ts
│       │   └── user.ts
│       │
│       ├── services/
│       │   ├── api.ts
│       │   ├── auth.ts
│       │   └── resumeService.ts
│       │
│       ├── context/
│       │   └── AuthContext.tsx
│       │
│       ├── routes/
│       │   ├── AppRoutes.tsx
│       │   └── ProtectedRoute.tsx
│       │
│       ├── layouts/
│       │   └── MainLayout.tsx
│       │
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Login.tsx
│       │   ├── Register.tsx
│       │   ├── Dashboard.tsx
│       │   ├── Resume.tsx
│       │   ├── ResumeAnalyzer.tsx
│       │   ├── Interview.tsx
│       │   └── NotFound.tsx
│       │
│       ├── components/
│       │   ├── dashboard/
│       │   ├── resume/
│       │   ├── home/
│       │   └── shared components
│       │
│       ├── utils/
│       │   ├── auth.ts
│       │   ├── pdfReport.ts
│       │   └── rating.ts
│       │
│       └── assets/
│
└── package-lock.json
```

------------------------------------------------------------------------

# 5. Backend Migration

The original backend was based on:

``` text
FastAPI
+
Uvicorn
+
SQLAlchemy
```

The current backend is based on:

``` text
Django
+
Django REST Framework
+
Django ORM
+
Simple JWT
```

### Important

The Django backend must be started with:

``` cmd
python manage.py runserver 8000
```

Do **not** start the Django backend with:

``` cmd
uvicorn app.main:app --reload
```

`uvicorn app.main:app` belongs to the old FastAPI architecture.

The old database is preserved as:

``` text
backend/skillverse_fastapi_backup.db
```

This backup should not be deleted until the Django migration has been
fully verified.

------------------------------------------------------------------------

# 6. Backend Setup

## Step 1 --- Open the backend directory

Example:

``` cmd
cd "C:\Users\THADURI SAI NAVEEN\skillverse-ai-django\skillverse-ai\backend"
```

Make sure this command works:

``` cmd
dir manage.py
```

You should see:

``` text
manage.py
```

------------------------------------------------------------------------

## Step 2 --- Create a virtual environment

Recommended:

``` cmd
python -m venv .venv
```

Activate it in CMD:

``` cmd
.venv\Scripts\activate
```

If activation succeeds, the command prompt normally shows:

``` text
(.venv)
```

------------------------------------------------------------------------

## Step 3 --- Install backend packages

``` cmd
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

------------------------------------------------------------------------

## Step 4 --- Configure environment variables

Copy:

``` text
.env.example
```

to:

``` text
.env
```

Example:

``` env
DJANGO_SECRET_KEY=change-this-secret-key
DEBUG=True
OPENAI_API_KEY=
```

For local development, the OpenAI key can remain empty. The interview
evaluator will use the built-in rule-based evaluator when no OpenAI key
is available.

------------------------------------------------------------------------

## Step 5 --- Run migrations

``` cmd
python manage.py makemigrations
python manage.py migrate
```

The development database is:

``` text
backend/skillverse.db
```

------------------------------------------------------------------------

## Step 6 --- Create an admin account

``` cmd
python manage.py createsuperuser
```

Follow the prompts.

------------------------------------------------------------------------

## Step 7 --- Check Django

``` cmd
python manage.py check
```

------------------------------------------------------------------------

## Step 8 --- Start the backend

``` cmd
python manage.py runserver 8000
```

Backend:

``` text
http://127.0.0.1:8000/
```

Root response:

``` json
{
  "message": "Welcome to SkillVerse AI 🚀"
}
```

Django admin:

``` text
http://127.0.0.1:8000/admin/
```

------------------------------------------------------------------------

# 7. Frontend Setup

Open another terminal.

Go to:

``` cmd
cd "C:\Users\THADURI SAI NAVEEN\skillverse-ai-django\skillverse-ai\frontend"
```

Install packages:

``` cmd
npm install
```

Start Vite:

``` cmd
npm run dev
```

The frontend normally runs at:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 8. Frontend Build

To create a production build:

``` cmd
npm run build
```

To preview the build:

``` cmd
npm run preview
```

------------------------------------------------------------------------

# 9. Frontend Routes

Current application routes include:

  Route          Purpose               Access
  -------------- --------------------- ------------------------
  `/`            Home page             Public
  `/login`       Login                 Public
  `/register`    Registration          Public
  `/dashboard`   Student dashboard     Protected
  `/resume`      Resume analyzer       Current frontend route
  `/interview`   Interview simulator   Protected
  `*`            Not found page        Public

Protected routes use the frontend `ProtectedRoute` component and the
authentication context.

------------------------------------------------------------------------

# 10. Authentication System

SkillVerse AI uses Django's built-in User model.

A user has:

-   ID
-   Username
-   Email
-   Password

Passwords are stored through Django's password hashing system.

Authentication uses JWT.

### Login flow

``` text
User
 ↓
React Login Page
 ↓
POST /auth/login
 ↓
Django authenticates user
 ↓
JWT access token returned
 ↓
Frontend stores token in localStorage
 ↓
Protected API requests use:
Authorization: Bearer <token>
```

------------------------------------------------------------------------

# 11. Authentication APIs

## Register

``` http
POST /auth/register
```

Example:

``` json
{
  "username": "student",
  "email": "student@example.com",
  "password": "password123"
}
```

Response includes:

``` json
{
  "message": "Registration successful",
  "access_token": "...",
  "token_type": "bearer"
}
```

------------------------------------------------------------------------

## Login

``` http
POST /auth/login
```

The current frontend sends the email as the username field when using
its Axios authentication API.

Example:

``` text
username=student@example.com
password=password123
```

The backend finds the user by email and authenticates the associated
Django username.

------------------------------------------------------------------------

## Token

``` http
POST /auth/token
```

The current implementation uses the same login behavior.

------------------------------------------------------------------------

## Current User

``` http
GET /user/me
```

Requires:

``` http
Authorization: Bearer <access_token>
```

Example response:

``` json
{
  "id": 1,
  "username": "student",
  "email": "student@example.com"
}
```

------------------------------------------------------------------------

# 12. Resume Analyzer

The Resume Analyzer is one of the main SkillVerse AI modules.

Supported files:

``` text
PDF
DOCX
TXT
```

The frontend limits uploaded files to:

``` text
5 MB
```

------------------------------------------------------------------------

## Resume processing pipeline

``` text
Resume File
    ↓
Upload
    ↓
Django REST API
    ↓
File Type Detection
    ↓
PDF/DOCX/TXT Text Extraction
    ↓
Resume Parser
    ↓
Contact Extraction
    ↓
Skill Extraction
    ↓
Education Extraction
    ↓
Project Extraction
    ↓
Experience Extraction
    ↓
Certification Extraction
    ↓
ATS Score
    ↓
Target Role Match
    ↓
Job Description Match
    ↓
Strengths
    ↓
Suggestions
    ↓
JSON Response
    ↓
React Dashboard
```

------------------------------------------------------------------------

# 13. Resume API

## Analyze Resume

``` http
POST /resume/analyze
```

Content type:

``` text
multipart/form-data
```

Fields:

``` text
file
role
job_description
```

Example target role:

``` text
Python Developer
```

Supported extensions:

``` text
.pdf
.docx
.txt
```

------------------------------------------------------------------------

# 14. Resume Parser

The parser currently extracts:

### Contact information

-   Name
-   Email
-   Phone
-   LinkedIn
-   GitHub

### Resume sections

-   Skills
-   Education
-   Projects
-   Experience
-   Certifications

The current technical skill dictionary includes technologies such as:

``` text
Python
Java
C
C++
JavaScript
TypeScript
React
Angular
Vue
FastAPI
Flask
Django
Node.js
Express
SQL
MySQL
PostgreSQL
MongoDB
Git
GitHub
Docker
AWS
HTML
CSS
Tailwind
Power BI
Excel
Machine Learning
AI
TensorFlow
Pandas
NumPy
```

------------------------------------------------------------------------

# 15. ATS Scoring

The current ATS-style scoring has a maximum of 100 points.

  Category       Maximum
  ------------ ---------
  Contact             15
  Skills              20
  Education           15
  Projects            20
  Experience          20
  Links               10
  **Total**      **100**

### Contact

-   Name: 5
-   Email: 5
-   Phone: 5

### Skills

Each detected technical skill contributes 2 points up to 20.

### Education

Education detected:

``` text
15 points
```

### Projects

Up to:

``` text
20 points
```

### Experience

Up to:

``` text
20 points
```

### Links

-   LinkedIn: 5
-   GitHub: 5

------------------------------------------------------------------------

# 16. Target Role Matching

The current supported target-role definitions are:

### Python Developer

``` text
Python
FastAPI
Flask
Django
SQL
Git
Docker
AWS
```

### Full Stack Developer

``` text
HTML
CSS
JavaScript
React
Node.js
Express
MongoDB
Git
```

### Data Analyst

``` text
Python
SQL
Excel
Power BI
Pandas
NumPy
```

### Java Developer

``` text
Java
Spring
SQL
Git
Docker
```

### AI/ML Engineer

``` text
Python
Machine Learning
TensorFlow
Pandas
NumPy
Git
```

The backend calculates:

``` text
matched skills
missing skills
match percentage
```

------------------------------------------------------------------------

# 17. Job Description Matching

The Resume Analyzer also accepts:

``` text
job_description
```

The backend extracts words from the job description and compares them
against detected resume skills.

Response includes:

``` json
{
  "match": 75,
  "matched": [],
  "missing": []
}
```

The current implementation is a keyword-based matcher, not a semantic AI
matching system.

------------------------------------------------------------------------

# 18. Resume Strengths

The system identifies strengths such as:

-   Strong Technical Skills
-   Good Project Portfolio
-   Education Section Present
-   GitHub Profile Included
-   LinkedIn Profile Included

------------------------------------------------------------------------

# 19. Resume Suggestions

The system can suggest:

-   Add more technical skills.
-   Include internships or work experience.
-   Add 2--3 strong projects.
-   Include LinkedIn.
-   Include GitHub.
-   Add relevant certifications.

------------------------------------------------------------------------

# 20. Resume Frontend Dashboard

The current Resume page includes components for:

-   File upload
-   Role selection
-   Job description input
-   Dashboard statistics
-   ATS score
-   Resume completion
-   Resume information
-   Resume preview
-   ATS breakdown
-   Job match
-   Strengths
-   Suggestions
-   Matched skills
-   Missing skills
-   Resume analytics
-   PDF/download report
-   Print report
-   Resume history

Resume history is currently stored in browser `localStorage` using:

``` text
resumeHistory
```

The frontend keeps the latest 10 entries.

------------------------------------------------------------------------

# 21. Resume Report

The frontend includes PDF report generation using `jsPDF`.

The report can include:

-   ATS score
-   Job match
-   Candidate information
-   Strengths
-   Suggestions

The generated report is saved as:

``` text
Resume_Report.pdf
```

------------------------------------------------------------------------

# 22. Interview Preparation Module

The Interview module provides technical interview practice.

Current question banks include:

### Python Developer

Examples:

-   Python decorators
-   List comprehension
-   List vs tuple
-   Generators
-   GIL
-   Multithreading
-   Deep copy vs shallow copy
-   Context managers
-   Python OOP
-   Lambda functions

### React Developer

Examples:

-   React Hooks
-   useEffect
-   Props vs state
-   Virtual DOM
-   Context API
-   JSX
-   React Router
-   Memoization
-   useMemo vs useCallback
-   Controlled components

### Java Developer

Examples:

-   JVM
-   JDK vs JRE
-   OOP
-   Multithreading
-   Exception handling
-   HashMap vs Hashtable
-   Spring Boot
-   Collections
-   Hibernate
-   Interface vs abstract class

------------------------------------------------------------------------

# 23. Interview Question Generation

API:

``` http
GET /interview/start
```

Parameters:

``` text
role
count
```

Example:

``` text
/interview/start?role=Python%20Developer&count=5
```

The backend randomly selects questions from the role's question bank.

------------------------------------------------------------------------

# 24. Interview Answer Evaluation

API:

``` http
POST /interview/evaluate
```

Request:

``` json
{
  "question": "What are Python decorators?",
  "answer": "..."
}
```

The evaluator checks factors such as:

-   Answer length
-   Relevant keywords
-   Technical concepts

The score is from:

``` text
0–10
```

------------------------------------------------------------------------

# 25. Optional AI Interview Evaluation

If:

``` env
OPENAI_API_KEY=
```

contains a valid API key, the backend attempts an OpenAI-powered
evaluation.

The AI evaluator is instructed to consider:

-   Technical correctness
-   Relevance
-   Clarity
-   Depth
-   Practical understanding

It returns:

``` json
{
  "score": 0,
  "feedback": "",
  "strengths": [],
  "improvements": []
}
```

If the key is missing or the AI request fails, the application falls
back to the built-in rule-based evaluator.

------------------------------------------------------------------------

# 26. Interview Summary

API:

``` http
POST /interview/summary
```

Request:

``` json
{
  "role": "Python Developer",
  "answers": [
    {
      "question": "What are generators?",
      "answer": "..."
    }
  ]
}
```

Response includes:

-   Role
-   Average score
-   Number of questions
-   Individual feedback

------------------------------------------------------------------------

# 27. Interview Persistence

Completed interviews can be stored in the Django database.

Model:

``` text
Interview
```

Fields:

  Field            Description
  ---------------- --------------------
  user             Django user
  role             Interview role
  interview_type   Interview category
  score            Final score
  feedback         Feedback text
  created_at       Creation timestamp

------------------------------------------------------------------------

# 28. Interview APIs

  Method   Endpoint                Authentication
  -------- ----------------------- ----------------
  GET      `/interview/start`      Public
  POST     `/interview/evaluate`   Public
  POST     `/interview/summary`    Public
  POST     `/interview/save`       JWT required
  GET      `/interview/history`    JWT required
  GET      `/interview/stats`      JWT required

------------------------------------------------------------------------

# 29. Interview Statistics

The statistics API returns:

``` json
{
  "total_interviews": 0,
  "average_score": 0,
  "highest_score": 0,
  "latest_score": 0
}
```

For users with saved interviews, the values are calculated from the
database.

------------------------------------------------------------------------

# 30. CORS Configuration

The backend currently allows the Vite development ports:

``` text
http://localhost:5173
http://localhost:5174
http://127.0.0.1:5173
http://127.0.0.1:5174
```

This allows the React development server to communicate with Django.

------------------------------------------------------------------------

# 31. Database

The Django development database is SQLite:

``` text
skillverse.db
```

Django manages database changes through migrations.

Important commands:

``` cmd
python manage.py makemigrations
python manage.py migrate
```

The old FastAPI database is preserved as:

``` text
skillverse_fastapi_backup.db
```

------------------------------------------------------------------------

# 32. Django Admin

Create an administrator:

``` cmd
python manage.py createsuperuser
```

Run the backend:

``` cmd
python manage.py runserver 8000
```

Open:

``` text
http://127.0.0.1:8000/admin/
```

The Interview model is registered with Django Admin.

------------------------------------------------------------------------

# 33. API Base URL

Development backend:

``` text
http://127.0.0.1:8000
```

Frontend API code currently uses this address.

If the backend port changes, update the Axios base URL in the frontend
API/service files.

------------------------------------------------------------------------

# 34. Complete API Reference

## General

``` text
GET /
```

## Authentication

``` text
POST /auth/register
POST /auth/login
POST /auth/token
GET  /user/me
```

## Resume

``` text
POST /resume/analyze
```

## Interview

``` text
GET  /interview/start
POST /interview/evaluate
POST /interview/summary
POST /interview/save
GET  /interview/history
GET  /interview/stats
```

## Admin

``` text
GET /admin/
```

------------------------------------------------------------------------

# 35. Complete Local Startup

Open **Terminal 1**:

``` cmd
cd "C:\Users\THADURI SAI NAVEEN\skillverse-ai-django\skillverse-ai\backend"
```

Activate the environment:

``` cmd
.venv\Scripts\activate
```

Install dependencies:

``` cmd
python -m pip install -r requirements.txt
```

Run migrations:

``` cmd
python manage.py migrate
```

Start Django:

``` cmd
python manage.py runserver 8000
```

Open **Terminal 2**:

``` cmd
cd "C:\Users\THADURI SAI NAVEEN\skillverse-ai-django\skillverse-ai\frontend"
```

Install frontend packages:

``` cmd
npm install
```

Start React:

``` cmd
npm run dev
```

Then open:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 36. Recommended Development Order

When continuing development, use this order:

``` text
1. Start Django backend
       ↓
2. Test /
       ↓
3. Test registration
       ↓
4. Test login
       ↓
5. Test /user/me
       ↓
6. Test Resume Analyzer
       ↓
7. Test Interview
       ↓
8. Test Dashboard
       ↓
9. Improve UI/UX
       ↓
10. Add remaining SkillVerse modules
```

------------------------------------------------------------------------

# 37. Planned SkillVerse AI Modules

The overall project vision can be expanded with:

-   Authentication
-   Student profile
-   Resume Builder
-   Resume ATS Checker
-   AI Interview Simulator
-   Aptitude Tests
-   Coding Challenges
-   Skill Tracker
-   Project Portfolio
-   Certificate Manager
-   Company Preparation Roadmaps
-   Analytics Dashboard
-   AI Chatbot Mentor
-   Cover Letter Generator
-   Career Mentor

Potential additional features:

-   Dark mode
-   Email notifications
-   Badges
-   Weekly reports
-   Calendar planner
-   Leaderboards
-   Coding streaks

These are part of the project roadmap; not all are implemented in the
current package.

------------------------------------------------------------------------

# 38. Current Implemented Modules

### Implemented / present

``` text
Authentication
Resume Analyzer
ATS scoring
Role matching
Job description matching
Resume report
Interview question generation
Interview evaluation
Optional AI evaluation
Interview saving
Interview history
Interview statistics
Dashboard UI
React routing
Protected routes
Django Admin
```

### Roadmap / incomplete

``` text
Full Resume Builder
Aptitude Test Engine
Coding Challenge Engine
Skill Tracker
Certificate Manager
Company Roadmaps
AI Chatbot Mentor
Full Career Mentor
Email Notification System
Leaderboard
Calendar Planner
```

------------------------------------------------------------------------

# 39. Known Limitations

## 1. Role list consistency

The frontend contains a broader set of role choices in its resume role
selector than the current backend `JOB_ROLES` dictionary.

The backend currently has defined matching rules for:

``` text
Python Developer
Full Stack Developer
Data Analyst
Java Developer
AI/ML Engineer
```

Additional frontend roles should be added to the backend dictionary
before they are expected to produce meaningful role-match percentages.

------------------------------------------------------------------------

## 2. Job-description matching is keyword based

The current job-description matcher compares detected resume skills with
words in the job description.

It is not yet a semantic embedding/LLM-based matching system.

------------------------------------------------------------------------

## 3. Resume parser is rule based

Resume extraction uses regular expressions and simple section detection.

Complexly formatted resumes may not be parsed perfectly.

------------------------------------------------------------------------

## 4. Resume history is browser-local

Resume history is stored in:

``` text
localStorage
```

It is not yet stored in the Django database.

------------------------------------------------------------------------

## 5. Interview evaluation fallback

Without an OpenAI API key, interview evaluation uses the built-in
keyword/answer-length evaluator.

------------------------------------------------------------------------

## 6. Development database

SQLite is appropriate for development and academic projects.

For production deployment, PostgreSQL is recommended.

------------------------------------------------------------------------

## 7. Development CORS

The current CORS configuration is designed for local development.

Production domains should be explicitly configured before deployment.

------------------------------------------------------------------------

# 40. Troubleshooting

## `manage.py` not found

If:

``` text
python: can't open file 'manage.py'
```

appears, you are probably in the wrong directory.

Run:

``` cmd
dir /s /b manage.py
```

Then change to the directory containing `manage.py`.

------------------------------------------------------------------------

## `ModuleNotFoundError: No module named 'app'`

This normally means the old FastAPI command is being used.

Do not run:

``` cmd
uvicorn app.main:app --reload
```

Use:

``` cmd
python manage.py runserver 8000
```

------------------------------------------------------------------------

## FastAPI/Pylance errors

The Django backend no longer requires:

``` python
from fastapi import FastAPI
```

or:

``` python
from fastapi.middleware.cors import CORSMiddleware
```

Those belong to the previous FastAPI backend.

------------------------------------------------------------------------

## Port 8000 already in use

Use:

``` cmd
python manage.py runserver 8001
```

Then update the frontend API base URL to:

``` text
http://127.0.0.1:8001
```

------------------------------------------------------------------------

## CORS error

Make sure Django is running and the frontend is using one of the
configured Vite origins.

Current allowed origins:

``` text
localhost:5173
localhost:5174
127.0.0.1:5173
127.0.0.1:5174
```

------------------------------------------------------------------------

## Database migration problems

Run:

``` cmd
python manage.py makemigrations
python manage.py migrate
```

For a development-only reset, stop the server and remove the Django
SQLite database, then run migrations again.

Do not delete the old FastAPI backup database unless you are certain it
is no longer needed.

------------------------------------------------------------------------

# 41. Security Notes

The current configuration is intended for development.

Before production deployment:

-   Change `DJANGO_SECRET_KEY`.
-   Set `DEBUG=False`.
-   Configure production `ALLOWED_HOSTS`.
-   Configure production CORS.
-   Use HTTPS.
-   Store secrets in environment variables.
-   Do not commit `.env`.
-   Use PostgreSQL or another production database.
-   Configure secure cookies and security middleware as appropriate.
-   Restrict file upload size and file types on the server as well as
    the frontend.
-   Add stronger authentication/rate limiting where required.
-   Protect OpenAI API keys.

------------------------------------------------------------------------

# 42. Suggested Production Architecture

``` text
                    Internet
                       │
                       ▼
                ┌───────────────┐
                │ Reverse Proxy │
                │ Nginx / Cloud │
                └───────┬───────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
   React Static Build          Django + DRF
                                      │
                        ┌─────────────┼─────────────┐
                        ▼             ▼             ▼
                   PostgreSQL     File Storage   OpenAI
```

------------------------------------------------------------------------

# 43. Academic Project Description

### Short Description

**SkillVerse AI is an AI-assisted career and placement preparation
platform that helps students analyze resumes, understand ATS
compatibility, identify job-specific skill gaps, practice technical
interviews, and track interview performance from a unified web
application.**

### Problem Statement

Students often use separate tools for resume preparation, job matching,
interview practice, and career tracking. This creates fragmented
preparation workflows and makes it difficult to understand overall job
readiness.

### Proposed System

SkillVerse AI provides a centralized web platform where a student can
upload a resume, receive an ATS-style score, compare skills against a
target role or job description, receive improvement suggestions,
practice technical interview questions, receive answer feedback, and
maintain interview performance history.

### Main Technologies

``` text
Frontend:
React + TypeScript + Vite

Backend:
Django + Django REST Framework

Authentication:
JWT

Database:
SQLite for development

Resume Processing:
PyMuPDF + python-docx + Python parsing

AI:
Optional OpenAI API

Visualization:
Chart.js + React Circular Progressbar
```

------------------------------------------------------------------------

# 44. Project Data Flow

### Registration

``` text
Register Page
    ↓
POST /auth/register
    ↓
Django User
    ↓
JWT Access Token
    ↓
localStorage
```

### Login

``` text
Login Page
    ↓
POST /auth/login
    ↓
Django Authentication
    ↓
JWT
    ↓
Protected Requests
```

### Resume Analysis

``` text
Resume
  ↓
Upload
  ↓
Django
  ↓
Text Extraction
  ↓
Parser
  ↓
ATS + Role Match + JD Match
  ↓
JSON
  ↓
React Dashboard
```

### Interview

``` text
Select Role
  ↓
GET /interview/start
  ↓
Questions
  ↓
Student Answers
  ↓
POST /interview/evaluate
  ↓
Feedback
  ↓
Summary
  ↓
Save
  ↓
History + Statistics
```

------------------------------------------------------------------------

# 45. Development Commands Cheat Sheet

## Backend

``` cmd
cd backend
```

``` cmd
python -m venv .venv
```

``` cmd
.venv\Scripts\activate
```

``` cmd
python -m pip install -r requirements.txt
```

``` cmd
python manage.py check
```

``` cmd
python manage.py makemigrations
```

``` cmd
python manage.py migrate
```

``` cmd
python manage.py createsuperuser
```

``` cmd
python manage.py runserver 8000
```

------------------------------------------------------------------------

## Frontend

``` cmd
cd frontend
```

``` cmd
npm install
```

``` cmd
npm run dev
```

``` cmd
npm run build
```

``` cmd
npm run preview
```

------------------------------------------------------------------------

# 46. Final Project Status

The project has successfully moved from a **FastAPI-based backend
architecture to Django + Django REST Framework** in the current package.

Current major backend applications:

``` text
accounts
resume_api
interviews
```

Current frontend technology:

``` text
React
TypeScript
Vite
```

The project is structured so that additional SkillVerse AI modules can
be added without replacing the existing authentication, resume, and
interview systems.

------------------------------------------------------------------------

## SkillVerse AI

**Build skills. Practice interviews. Improve your resume. Become
job-ready.**

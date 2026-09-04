# IDP Recommendation System

A personalized Intelligent Development Plan (IDP) Recommendation System that helps students identify skill gaps, evaluate career readiness, set career goals, and receive personalized learning recommendations and roadmaps.

## 🚀 Features

- Student login and authentication
- Student profile management
- Skill assessment
- Career goal selection
- Skill-gap analysis
- Career readiness score
- Personalized learning-resource recommendations
- Personalized learning roadmap
- Flashcard-based learning
- Flashcard progress and mastery tracking
- Learning-resource completion tracking
- Admin dashboard with student and system statistics

## 🏗️ Project Structure

```text
IDP-Recommendation-System/
│
├── app/
│   ├── database/
│   │   ├── connection.py
│   │   ├── init_db.py
│   │   ├── models.py
│   │   └── seed.py
│   │
│   ├── schemas/
│   │   ├── assessment.py
│   │   ├── career.py
│   │   ├── career_goal.py
│   │   ├── flashcard.py
│   │   ├── recommendation.py
│   │   ├── skill.py
│   │   └── student.py
│   │
│   ├── services/
│   │   ├── recommendation.py
│   │   └── roadmap.py
│   │
│   ├── utils/
│   │   └── security.py
│   │
│   ├── fix_passwords.py
│   └── main.py
│
├── .gitignore
├── README.md
└── requirements.txt
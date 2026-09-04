from fastapi import FastAPI
from pydantic import BaseModel
from .database.connection import SessionLocal, Base, engine
from .database.models import (
    Student,
    Skill,
    Career,
    LearningResource,
    StudentSkill,
    Flashcard,
    FlashcardProgress,
    StudentResourceProgress,
    User
)
from .schemas.student import StudentResponse
from .schemas.assessment import AssessmentRequest
from .schemas.career_goal import CareerGoalRequest
from .services.recommendation import (
    calculate_skill_gaps,
    calculate_readiness,
    get_recommended_resources
)
from fastapi.middleware.cors import CORSMiddleware
from .services.roadmap import create_roadmap
from .utils.security import verify_password


Base.metadata.create_all(bind=engine)
app = FastAPI()

class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:
        db.close()
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    if not verify_password(data.password, user.password):
        db.close()
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    result = {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "student_id": user.student_id
        }
    }

    db.close()

    return result


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def home():
    return {"message": "IDP Recommendation API is running"}


@app.get("/careers")
def get_careers():
    db = SessionLocal()

    careers = db.query(Career).all()

    db.close()

    return careers


@app.get("/skills")
def get_skills():
    db = SessionLocal()

    skills = db.query(Skill).all()

    db.close()

    return skills


@app.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int):
    db = SessionLocal()

    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        db.close()
        return {"error": "Student not found"}

    result = {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "current_career": student.current_career.name if student.current_career else None,
        "target_career": student.target_career.name if student.target_career else None,
        "skills": []
    }

    for assessment in student.skill_assessments:
        result["skills"].append({
            "skill_id": assessment.skill.id,
            "skill_name": assessment.skill.name,
            "category": assessment.skill.category,
            "level": assessment.level
        })

    db.close()

    return result

@app.post("/assessment")
def submit_assessment(data: AssessmentRequest):
    db = SessionLocal()

    student = db.query(Student).filter(Student.id == data.student_id).first()

    if not student:
        db.close()
        return {"error": "Student not found"}

    for item in data.skills:
        assessment = db.query(StudentSkill).filter(
            StudentSkill.student_id == data.student_id,
            StudentSkill.skill_id == item.skill_id
        ).first()

        if assessment:
            assessment.level = item.level
        else:
            assessment = StudentSkill(
                student_id=data.student_id,
                skill_id=item.skill_id,
                level=item.level
            )
            db.add(assessment)

    db.commit()
    db.close()

    return {"message": "Assessment saved successfully"}

@app.post("/career-goal")
def set_career_goal(data: CareerGoalRequest):
    db = SessionLocal()

    student = db.query(Student).filter(
        Student.id == data.student_id
    ).first()

    if not student:
        db.close()
        return {"error": "Student not found"}

    current_career = db.query(Career).filter(
        Career.id == data.current_career_id
    ).first()

    target_career = db.query(Career).filter(
        Career.id == data.target_career_id
    ).first()

    if not current_career or not target_career:
        db.close()
        return {"error": "Career not found"}

    student.current_career_id = data.current_career_id
    student.target_career_id = data.target_career_id

    db.commit()

    result = {
        "message": "Career goals saved successfully",
        "current_career": current_career.name,
        "target_career": target_career.name
    }

    db.close()

    return result

@app.get("/dashboard/{student_id}")
def get_dashboard(student_id: int):
    db = SessionLocal()

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        db.close()
        return {"error": "Student not found"}

    if not student.target_career:
        db.close()
        return {"error": "Target career not set"}

    career = student.target_career

    skill_gaps = calculate_skill_gaps(student, career)
    readiness_score = calculate_readiness(student, career)

    db.close()

    return {
        "career": career.name,
        "readiness_score": readiness_score,
        "skill_gaps": skill_gaps
    }

@app.get("/recommendations/{student_id}")
def get_recommendations(student_id: int):
    db = SessionLocal()

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        db.close()
        return {"error": "Student not found"}

    if not student.target_career:
        db.close()
        return {"error": "Target career not set"}

    recommendations = get_recommended_resources(
        db,
        student,
        student.target_career
    )

    for recommendation in recommendations:
        progress = db.query(StudentResourceProgress).filter(
            StudentResourceProgress.student_id == student_id,
            StudentResourceProgress.resource_id == recommendation["id"]
        ).first()

        recommendation["completed"] = (
            progress.completed if progress else False
        )

    db.close()

    return recommendations

@app.post("/resources/{resource_id}/complete")
def complete_resource(resource_id: int, student_id: int):
    db = SessionLocal()

    resource = db.query(LearningResource).filter(
        LearningResource.id == resource_id
    ).first()

    if not resource:
        db.close()
        return {"error": "Resource not found"}

    progress = db.query(StudentResourceProgress).filter(
        StudentResourceProgress.student_id == student_id,
        StudentResourceProgress.resource_id == resource_id
    ).first()

    if progress:
        progress.completed = not progress.completed
    else:
        progress = StudentResourceProgress(
            student_id=student_id,
            resource_id=resource_id,
            completed=True
        )
        db.add(progress)

    db.commit()

    completed = progress.completed

    db.close()

    return {
        "message": "Resource progress updated",
        "completed": completed
    }

@app.get("/roadmap/{student_id}")
def get_roadmap(student_id: int):
    db = SessionLocal()

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        db.close()
        return {"error": "Student not found"}

    if not student.target_career:
        db.close()
        return {"error": "Target career not set"}

    career = student.target_career

    skill_gaps = calculate_skill_gaps(student, career)

    resources = get_recommended_resources(
        db,
        student,
        career
    )

    roadmap = create_roadmap(
        skill_gaps,
        resources
    )

    db.close()

    return roadmap

@app.get("/flashcards")
def get_flashcards():
    db = SessionLocal()

    flashcards = db.query(Flashcard).all()

    result = []

    for flashcard in flashcards:
        result.append({
            "id": flashcard.id,
            "question": flashcard.question,
            "answer": flashcard.answer,
            "subject": flashcard.subject,
            "skill": flashcard.skill.name
        })

    db.close()

    return result

@app.get("/flashcards/{student_id}")
def get_student_flashcards(student_id: int):
    db = SessionLocal()

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        db.close()
        return {"error": "Student not found"}

    flashcards = db.query(Flashcard).all()

    result = []

    for flashcard in flashcards:
        progress = db.query(FlashcardProgress).filter(
            FlashcardProgress.student_id == student_id,
            FlashcardProgress.flashcard_id == flashcard.id
        ).first()

        result.append({
            "id": flashcard.id,
            "question": flashcard.question,
            "answer": flashcard.answer,
            "subject": flashcard.subject,
            "skill": flashcard.skill.name,
            "reviewed": progress.reviewed if progress else False,
            "mastered": progress.mastered if progress else False
        })

    db.close()

    return result

@app.post("/flashcards/{flashcard_id}/review")
def review_flashcard(
    flashcard_id: int,
    student_id: int,
    mastered: bool
):
    db = SessionLocal()

    flashcard = db.query(Flashcard).filter(
        Flashcard.id == flashcard_id
    ).first()

    if not flashcard:
        db.close()
        return {"error": "Flashcard not found"}

    progress = db.query(FlashcardProgress).filter(
        FlashcardProgress.student_id == student_id,
        FlashcardProgress.flashcard_id == flashcard_id
    ).first()

    if progress:
        progress.reviewed = True
        progress.mastered = mastered
    else:
        progress = FlashcardProgress(
            student_id=student_id,
            flashcard_id=flashcard_id,
            reviewed=True,
            mastered=mastered
        )

        db.add(progress)

    db.commit()
    db.close()

    return {
        "message": "Flashcard progress saved successfully"
    }

@app.get("/admin/dashboard")
def admin_dashboard():
    db = SessionLocal()

    students = db.query(Student).all()
    careers = db.query(Career).all()
    skills = db.query(Skill).all()
    resources = db.query(LearningResource).all()

    total_readiness = 0
    readiness_count = 0

    for student in students:
        if student.target_career:
            readiness = calculate_readiness(
                student,
                student.target_career
            )

            total_readiness += readiness
            readiness_count += 1

    average_readiness = (
        round(total_readiness / readiness_count, 2)
        if readiness_count > 0
        else 0
    )

    result = {
        "total_students": len(students),
        "total_careers": len(careers),
        "total_skills": len(skills),
        "total_resources": len(resources),
        "average_readiness": average_readiness,
        "students": []
    }

    for student in students:
        readiness = None

        if student.target_career:
            readiness = calculate_readiness(
                student,
                student.target_career
            )

        result["students"].append({
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "current_career": (
                student.current_career.name
                if student.current_career
                else None
            ),
            "target_career": (
                student.target_career.name
                if student.target_career
                else None
            ),
            "readiness_score": readiness
        })

    db.close()

    return result
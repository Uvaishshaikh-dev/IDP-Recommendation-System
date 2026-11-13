from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .database.connection import SessionLocal, Base, engine

from .database.models import (
    Student,
    Skill,
    Career,
    StudentSkill,
    LearningResource,
    StudentResourceProgress,
    Flashcard,
    FlashcardProgress,
    User
)

from .services.recommendation import (
    calculate_skill_gaps,
    calculate_readiness,
    get_recommended_resources
)

from .services.roadmap import create_roadmap

from .utils.security import verify_password, hash_password


app = FastAPI(
    title="IDP Recommendation System API"
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://idp-recommendation-system-2.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class AssessmentItem(BaseModel):
    skill_id: int
    level: int


class AssessmentRequest(BaseModel):
    student_id: int
    assessments: list[AssessmentItem]


class CareerGoalRequest(BaseModel):
    student_id: int
    current_career_id: int | None = None
    target_career_id: int

@app.get("/")
def home():
    return {
        "message": "IDP Recommendation System API is running"
    }


@app.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.email == data.email
        ).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        if not verify_password(
            data.password,
            user.password
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        return {
            "message": "Login successful",
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "student_id": user.student_id
        }

    finally:
        db.close()


@app.get("/students/{student_id}")
def get_student(student_id: int):
    db = SessionLocal()

    try:
        student = db.query(Student).filter(
            Student.id == student_id
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        skills = []

        for assessment in student.skill_assessments:
            skills.append({
                "skill_id": assessment.skill_id,
                "skill_name": assessment.skill.name,
                "level": assessment.level,
                "category": assessment.skill.category
            })

        return {
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
            "current_career_id": student.current_career_id,
            "target_career_id": student.target_career_id,
            "skills": skills
        }

    finally:
        db.close()


@app.get("/careers")
def get_careers():
    db = SessionLocal()

    try:
        careers = db.query(Career).all()

        return [
            {
                "id": career.id,
                "name": career.name
            }
            for career in careers
        ]

    finally:
        db.close()


@app.get("/skills")
def get_skills():
    db = SessionLocal()

    try:
        skills = db.query(Skill).all()

        return [
            {
                "id": skill.id,
                "name": skill.name,
                "category": skill.category
            }
            for skill in skills
        ]

    finally:
        db.close()


@app.get("/dashboard/{student_id}")
def get_dashboard(student_id: int):
    db = SessionLocal()

    try:
        student = db.query(Student).filter(
            Student.id == student_id
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        if not student.target_career:
            return {
                "student_id": student.id,
                "student_name": student.name,
                "career": None,
                "readiness_score": 0,
                "skill_gaps": [],
                "message": "Please set your target career and complete your assessment"
            }

        career = student.target_career

        skill_gaps = calculate_skill_gaps(
            student,
            career
        )

        readiness_score = calculate_readiness(
            student,
            career
        )

        return {
            "student_id": student.id,
            "student_name": student.name,
            "career": career.name,
            "readiness_score": readiness_score,
            "skill_gaps": skill_gaps,
            "message": None
        }

    finally:
        db.close()


@app.get("/recommendations/{student_id}")
def get_recommendations(student_id: int):
    db = SessionLocal()

    try:
        student = db.query(Student).filter(
            Student.id == student_id
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        if not student.target_career:
            return []

        recommendations = get_recommended_resources(
            db,
            student,
            student.target_career
        )

        for recommendation in recommendations:
            progress = db.query(
                StudentResourceProgress
            ).filter(
                StudentResourceProgress.student_id == student_id,
                StudentResourceProgress.resource_id == recommendation["id"]
            ).first()

            recommendation["completed"] = (
                progress.completed
                if progress
                else False
            )

        return recommendations

    finally:
        db.close()


@app.get("/roadmap/{student_id}")
def get_roadmap(student_id: int):
    db = SessionLocal()

    try:
        student = db.query(Student).filter(
            Student.id == student_id
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        if not student.target_career:
            return []

        career = student.target_career

        skill_gaps = calculate_skill_gaps(
            student,
            career
        )

        resources = get_recommended_resources(
            db,
            student,
            career
        )

        roadmap = create_roadmap(
            skill_gaps,
            resources
        )

        return roadmap

    finally:
        db.close()


@app.post("/assessment")
def submit_assessment(data: AssessmentRequest):
    db = SessionLocal()

    try:
        student = db.query(Student).filter(
            Student.id == data.student_id
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        for item in data.assessments:
            skill = db.query(Skill).filter(
                Skill.id == item.skill_id
            ).first()

            if not skill:
                continue

            assessment = db.query(StudentSkill).filter(
                StudentSkill.student_id == data.student_id,
                StudentSkill.skill_id == item.skill_id
            ).first()

            if assessment:
                assessment.level = item.level
            else:
                new_assessment = StudentSkill(
                    student_id=data.student_id,
                    skill_id=item.skill_id,
                    level=item.level
                )

                db.add(new_assessment)

        db.commit()

        return {
            "message": "Assessment saved successfully"
        }

    finally:
        db.close()


@app.post("/career-goal")
def set_career_goal(data: CareerGoalRequest):
    db = SessionLocal()

    try:
        student = db.query(Student).filter(
            Student.id == data.student_id
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        target_career = db.query(Career).filter(
            Career.id == data.target_career_id
        ).first()

        if not target_career:
            raise HTTPException(
                status_code=404,
                detail="Target career not found"
            )

        student.target_career_id = data.target_career_id

        if data.current_career_id is not None:
            student.current_career_id = data.current_career_id

        db.commit()

        return {
            "message": "Career goal updated successfully"
        }

    finally:
        db.close()


@app.get("/flashcards/{student_id}")
def get_student_flashcards(student_id: int):
    db = SessionLocal()

    try:
        student = db.query(Student).filter(
            Student.id == student_id
        ).first()

        if not student:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        flashcards = db.query(Flashcard).all()

        result = []

        for flashcard in flashcards:
            progress = db.query(
                FlashcardProgress
            ).filter(
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

        return result

    finally:
        db.close()


@app.post("/flashcards/{flashcard_id}/review")
def review_flashcard(
    flashcard_id: int,
    student_id: int,
    mastered: bool
):
    db = SessionLocal()

    try:
        flashcard = db.query(Flashcard).filter(
            Flashcard.id == flashcard_id
        ).first()

        if not flashcard:
            raise HTTPException(
                status_code=404,
                detail="Flashcard not found"
            )

        progress = db.query(
            FlashcardProgress
        ).filter(
            FlashcardProgress.student_id == student_id,
            FlashcardProgress.flashcard_id == flashcard_id
        ).first()

        if not progress:
            progress = FlashcardProgress(
                student_id=student_id,
                flashcard_id=flashcard_id,
                reviewed=True,
                mastered=mastered
            )

            db.add(progress)

        else:
            progress.reviewed = True
            progress.mastered = mastered

        db.commit()

        return {
            "message": "Flashcard progress updated"
        }

    finally:
        db.close()


@app.post("/resources/{resource_id}/complete")
def complete_resource(
    resource_id: int,
    student_id: int
):
    db = SessionLocal()

    try:
        resource = db.query(LearningResource).filter(
            LearningResource.id == resource_id
        ).first()

        if not resource:
            raise HTTPException(
                status_code=404,
                detail="Resource not found"
            )

        progress = db.query(
            StudentResourceProgress
        ).filter(
            StudentResourceProgress.student_id == student_id,
            StudentResourceProgress.resource_id == resource_id
        ).first()

        if not progress:
            progress = StudentResourceProgress(
                student_id=student_id,
                resource_id=resource_id,
                completed=True
            )

            db.add(progress)

        else:
            progress.completed = not progress.completed

        db.commit()

        return {
            "message": "Resource progress updated",
            "completed": progress.completed
        }

    finally:
        db.close()


@app.get("/admin/dashboard")
def get_admin_dashboard():
    db = SessionLocal()

    try:
        total_students = db.query(Student).count()
        total_skills = db.query(Skill).count()
        total_careers = db.query(Career).count()
        total_resources = db.query(LearningResource).count()

        return {
            "total_students": total_students,
            "total_skills": total_skills,
            "total_careers": total_careers,
            "total_resources": total_resources
        }

    finally:
        db.close()

@app.post("/register")
def register(data: RegisterRequest):

    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(
            User.email == data.email
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        student = Student(
            name=data.name,
            email=data.email
        )

        db.add(student)
        db.commit()
        db.refresh(student)

        user = User(
            email=data.email,
            password=hash_password(data.password),
            role="student",
            student_id=student.id
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "message": "Registration successful",
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "student_id": user.student_id
        }

    finally:
        db.close()
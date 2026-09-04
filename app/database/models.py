from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .connection import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    current_career_id = Column(Integer, ForeignKey("careers.id"), nullable=True)
    target_career_id = Column(Integer, ForeignKey("careers.id"), nullable=True)

    current_career = relationship(          #stores the ID of the student's current career.
        "Career",
        foreign_keys=[current_career_id]
    )

    target_career = relationship(
        "Career",
        foreign_keys=[target_career_id]
    )

    skill_assessments = relationship(
        "StudentSkill",
        back_populates="student",
        cascade="all, delete-orphan"
    )


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=False)

    student_assessments = relationship(
        "StudentSkill",
        back_populates="skill"
    )

    career_requirements = relationship(
        "CareerSkill",
        back_populates="skill"
    )


class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    required_skills = relationship(
        "CareerSkill",
        back_populates="career",
        cascade="all, delete-orphan"
    )


class StudentSkill(Base):
    __tablename__ = "student_skills"

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        primary_key=True
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        primary_key=True
    )

    level = Column(Integer, nullable=False, default=1)

    student = relationship(
        "Student",
        back_populates="skill_assessments"
    )

    skill = relationship(
        "Skill",
        back_populates="student_assessments"
    )


class CareerSkill(Base):
    __tablename__ = "career_skills"

    career_id = Column(
        Integer,
        ForeignKey("careers.id"),
        primary_key=True
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        primary_key=True
    )

    required_level = Column(Integer, nullable=False, default=3)

    career = relationship(
        "Career",
        back_populates="required_skills"
    )

    skill = relationship(
        "Skill",
        back_populates="career_requirements"
    )


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    resource_type = Column(String, nullable=False)
    provider = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    difficulty = Column(String, nullable=True)

    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)

    skill = relationship("Skill")

class StudentResourceProgress(Base):
    __tablename__ = "student_resource_progress"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("learning_resources.id"), nullable=False)

    completed = Column(Boolean, default=False)

    student = relationship("Student")
    resource = relationship("LearningResource")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    subject = Column(String, nullable=False)

    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)

    skill = relationship("Skill")


class FlashcardProgress(Base):
    __tablename__ = "flashcard_progress"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    flashcard_id = Column(Integer, ForeignKey("flashcards.id"), nullable=False)

    reviewed = Column(Boolean, default=False)
    mastered = Column(Boolean, default=False)

    student = relationship("Student")
    flashcard = relationship("Flashcard")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    role = Column(String, nullable=False)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=True
    )

    student = relationship("Student")
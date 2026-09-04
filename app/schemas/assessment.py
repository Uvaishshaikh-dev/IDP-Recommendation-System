from pydantic import BaseModel, Field


class SkillAssessment(BaseModel):
    skill_id: int
    level: int = Field(ge=1, le=5)


class AssessmentRequest(BaseModel):
    student_id: int
    skills: list[SkillAssessment]
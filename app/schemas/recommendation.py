from pydantic import BaseModel


class SkillGapResponse(BaseModel):
    skill: str
    current_level: int
    required_level: int
    gap: int


class RecommendationResponse(BaseModel):
    career: str
    readiness_score: float
    skill_gaps: list[SkillGapResponse]
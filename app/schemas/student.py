from pydantic import BaseModel


class StudentSkillResponse(BaseModel):
    skill_id: int
    skill_name: str
    category: str
    level: int


class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    current_career: str | None
    target_career: str | None
    skills: list[StudentSkillResponse]
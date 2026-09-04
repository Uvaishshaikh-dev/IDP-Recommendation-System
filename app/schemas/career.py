from pydantic import BaseModel


class CareerSkillResponse(BaseModel):
    skill_id: int
    skill_name: str
    required_level: int


class CareerResponse(BaseModel):
    id: int
    name: str
    skills: list[CareerSkillResponse]
from pydantic import BaseModel


class CareerGoalRequest(BaseModel):
    student_id: int
    current_career_id: int
    target_career_id: int
from pydantic import BaseModel


class FlashcardResponse(BaseModel):
    id: int
    question: str
    answer: str
    subject: str
    skill: str
    reviewed: bool
    mastered: bool
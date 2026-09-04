from .connection import Base, engine
from .models import Student, Skill, Career, StudentSkill, CareerSkill, LearningResource, StudentResourceProgress, Flashcard, FlashcardProgress


Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")
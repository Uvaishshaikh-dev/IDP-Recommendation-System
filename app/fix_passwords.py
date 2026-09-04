import bcrypt

from app.database.connection import SessionLocal
from app.database.models import User


db = SessionLocal()

student = db.query(User).filter(
    User.email == "student@idp.com"
).first()

admin = db.query(User).filter(
    User.email == "admin@idp.com"
).first()

if student:
    student.password = bcrypt.hashpw(
        "student123".encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

if admin:
    admin.password = bcrypt.hashpw(
        "admin123".encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

db.commit()
db.close()

print("Passwords updated successfully!")
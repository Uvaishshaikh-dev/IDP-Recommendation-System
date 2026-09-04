from .connection import SessionLocal
from .models import (
    Student,
    Skill,
    Career,
    StudentSkill,
    CareerSkill,
    LearningResource,
    Flashcard,
    User
)
from ..utils.security import hash_password

db = SessionLocal()


skills_data = [
    ("JavaScript / TypeScript", "Technical"),
    ("React.js", "Technical"),
    ("Node.js", "Technical"),
    ("Python", "Technical"),
    ("System Design", "Technical"),
    ("Communication", "Soft"),
    ("Agile & Scrum", "Soft")
]


skills = {}

for name, category in skills_data:
    existing_skill = db.query(Skill).filter(Skill.name == name).first()

    if existing_skill:
        skill = existing_skill
    else:
        skill = Skill(name=name, category=category)
        db.add(skill)

    skills[name] = skill


db.commit()


careers_data = {
    "Frontend Developer": {
        "JavaScript / TypeScript": 5,
        "React.js": 5,
        "System Design": 3,
        "Communication": 4,
        "Agile & Scrum": 4
    },

    "Backend Developer": {
        "Python": 5,
        "Node.js": 4,
        "System Design": 4,
        "Communication": 3
    },

    "Full Stack Developer": {
        "JavaScript / TypeScript": 5,
        "React.js": 4,
        "Node.js": 4,
        "Python": 3,
        "System Design": 4,
        "Communication": 4
    },

    "Data Scientist": {
        "Python": 5,
        "System Design": 3,
        "Communication": 4
    },

    "Product Manager": {
        "Communication": 5,
        "Agile & Scrum": 5,
        "System Design": 3
    }
}


careers = {}

for career_name in careers_data:
    existing_career = db.query(Career).filter(
        Career.name == career_name
    ).first()

    if existing_career:
        career = existing_career
    else:
        career = Career(name=career_name)
        db.add(career)

    careers[career_name] = career


db.commit()


for career_name, required_skills in careers_data.items():
    for skill_name, required_level in required_skills.items():

        existing_requirement = db.query(CareerSkill).filter(
            CareerSkill.career_id == careers[career_name].id,
            CareerSkill.skill_id == skills[skill_name].id
        ).first()

        if not existing_requirement:
            career_skill = CareerSkill(
                career_id=careers[career_name].id,
                skill_id=skills[skill_name].id,
                required_level=required_level
            )

            db.add(career_skill)


db.commit()


student = db.query(Student).filter(
    Student.email == "alex@example.com"
).first()

if not student:
    student = Student(
        name="Alex",
        email="alex@example.com",
        current_career_id=careers["Frontend Developer"].id,
        target_career_id=careers["Backend Developer"].id
    )

    db.add(student)
    db.commit()


student_levels = {
    "JavaScript / TypeScript": 2,
    "React.js": 3,
    "Node.js": 2,
    "Python": 3,
    "System Design": 3,
    "Communication": 3,
    "Agile & Scrum": 3
}


for skill_name, level in student_levels.items():

    existing_assessment = db.query(StudentSkill).filter(
        StudentSkill.student_id == student.id,
        StudentSkill.skill_id == skills[skill_name].id
    ).first()

    if existing_assessment:
        existing_assessment.level = level
    else:
        student_skill = StudentSkill(
            student_id=student.id,
            skill_id=skills[skill_name].id,
            level=level
        )

        db.add(student_skill)


db.commit()


resources_data = [
    (
        "Modern JavaScript Foundations",
        "Strengthen ES6+, asynchronous programming, and clean code habits.",
        "Course",
        "freeCodeCamp",
        "2 weeks",
        "Intermediate",
        "JavaScript / TypeScript",
        "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"
    ),
    (
        "Advanced React Patterns",
        "Deep dive into React performance and hooks.",
        "Course",
        "Frontend Masters",
        "4 weeks",
        "Advanced",
        "React.js",
        "https://frontendmasters.com/courses/advanced-react-patterns/"
    ),
    (
        "Node.js Microservices",
        "Build robust backend services with Node.js and Express.",
        "Course",
        "Udemy",
        "3 weeks",
        "Intermediate",
        "Node.js",
        "https://www.udemy.com/topic/nodejs/"
    ),
    (
        "Python for Developers",
        "Build strong Python programming fundamentals.",
        "Course",
        "freeCodeCamp",
        "4 weeks",
        "Beginner",
        "Python",
        "https://www.freecodecamp.org/learn/python-for-everybody/"
    ),
    (
        "System Design Interview Prep",
        "Learn to design scalable software systems.",
        "Book",
        "Educative",
        "2 weeks",
        "Intermediate",
        "System Design",
        "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers"
    ),
    (
        "Effective Communication in Tech",
        "Improve communication and stakeholder collaboration.",
        "Mentorship",
        "Internal Mentor Program",
        "Ongoing",
        "All Levels",
        "Communication",
        "https://www.coursera.org/courses?query=technical%20communication"
    ),
    (
        "Agile & Scrum Fundamentals",
        "Learn Agile principles and Scrum practices.",
        "Course",
        "Coursera",
        "3 weeks",
        "Beginner",
        "Agile & Scrum",
        "https://www.coursera.org/courses?query=agile%20scrum"
    )
]


for title, description, resource_type, provider, duration, difficulty, skill_name, url in resources_data:

    existing_resource = db.query(LearningResource).filter(
        LearningResource.title == title
    ).first()

    if not existing_resource:
        resource = LearningResource(
            title=title,
            url=url,
            description=description,
            resource_type=resource_type,
            provider=provider,
            duration=duration,
            difficulty=difficulty,
            skill_id=skills[skill_name].id
        )

        db.add(resource)


db.commit()


flashcards_data = [
    (
        "What is a closure in JavaScript?",
        "A closure is a function that remembers and can access variables from its outer scope.",
        "Web Development",
        "JavaScript / TypeScript"
    ),
    (
        "What is the difference between let and const in JavaScript?",
        "let allows reassignment while const does not allow reassignment.",
        "Web Development",
        "JavaScript / TypeScript"
    ),
    (
        "What is a React component?",
        "A React component is a reusable piece of UI that can accept data through props.",
        "Web Development",
        "React.js"
    ),
    (
        "What is middleware in Node.js?",
        "Middleware is a function that runs during the request-response cycle and can modify the request or response.",
        "Backend Development",
        "Node.js"
    ),
    (
        "What is system design?",
        "System design is the process of planning the architecture and components of a software system.",
        "Software Engineering",
        "System Design"
    ),
    (
        "What is horizontal scaling?",
        "Horizontal scaling means adding more machines or instances to handle increased load.",
        "Software Engineering",
        "System Design"
    ),
    (
        "What is Python commonly used for?",
        "Python is commonly used for programming, automation, data processing, and backend development.",
        "Programming",
        "Python"
    ),
    (
        "What is the purpose of Agile?",
        "Agile focuses on iterative development, collaboration, feedback, and adapting to changing requirements.",
        "Project Management",
        "Agile & Scrum"
    )
]


for question, answer, subject, skill_name in flashcards_data:

    existing_flashcard = db.query(Flashcard).filter(
        Flashcard.question == question
    ).first()

    if not existing_flashcard:
        flashcard = Flashcard(
            question=question,
            answer=answer,
            subject=subject,
            skill_id=skills[skill_name].id
        )

        db.add(flashcard)


db.commit()


student_user = db.query(User).filter(
    User.email == "student@idp.com"
).first()

if not student_user:
    student_user = User(
        email="student@idp.com",
        password=hash_password("student123"),
        role="student",
        student_id=student.id
    )

    db.add(student_user)


admin_user = db.query(User).filter(
    User.email == "admin@idp.com"
).first()

if not admin_user:
    admin_user = User(
        email="admin@idp.com",
        password=hash_password("admin123"),
        role="admin",
        student_id=None
    )

    db.add(admin_user)


db.commit()

db.close()

print("Database seeded successfully!")
print("Student login: student@idp.com / student123")
print("Admin login: admin@idp.com / admin123")
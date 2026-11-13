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

    # =========================
    # JAVASCRIPT / TYPESCRIPT
    # =========================

    (
        "What is a closure in JavaScript?",
        "A closure is a function that can access variables from its outer scope.",
        "Web Development",
        "JavaScript / TypeScript"
    ),
    (
        "What is the difference between let and const?",
        "let allows reassignment while const cannot be reassigned.",
        "Web Development",
        "JavaScript / TypeScript"
    ),
    (
        "What is a Promise in JavaScript?",
        "A Promise represents the eventual result of an asynchronous operation.",
        "Web Development",
        "JavaScript / TypeScript"
    ),
    (
        "What does async and await do?",
        "They make asynchronous Promise-based code easier to write and read.",
        "Web Development",
        "JavaScript / TypeScript"
    ),
    (
        "What is the JavaScript event loop?",
        "It manages asynchronous tasks by coordinating the call stack and task queues.",
        "Web Development",
        "JavaScript / TypeScript"
    ),


    # =========================
    # REACT.JS
    # =========================

    (
        "What is a React component?",
        "A React component is a reusable piece of UI.",
        "Web Development",
        "React.js"
    ),
    (
        "What are props in React?",
        "Props are inputs passed from a parent component to a child component.",
        "Web Development",
        "React.js"
    ),
    (
        "What is state in React?",
        "State stores data that can change and cause a component to re-render.",
        "Web Development",
        "React.js"
    ),
    (
        "What is useEffect used for?",
        "useEffect handles side effects such as API calls or subscriptions.",
        "Web Development",
        "React.js"
    ),
    (
        "What is the virtual DOM?",
        "It is a lightweight representation of the real DOM used for efficient updates.",
        "Web Development",
        "React.js"
    ),


    # =========================
    # NODE.JS
    # =========================

    (
        "What is Node.js?",
        "Node.js is a JavaScript runtime that runs JavaScript outside the browser.",
        "Backend Development",
        "Node.js"
    ),
    (
        "What is middleware in Node.js?",
        "Middleware runs during the request-response cycle and can process requests.",
        "Backend Development",
        "Node.js"
    ),
    (
        "What is Express.js?",
        "Express.js is a framework for building web servers and APIs with Node.js.",
        "Backend Development",
        "Node.js"
    ),
    (
        "What is an API?",
        "An API allows different software applications to communicate with each other.",
        "Backend Development",
        "Node.js"
    ),
    (
        "What is npm?",
        "npm is the package manager used to install and manage Node.js packages.",
        "Backend Development",
        "Node.js"
    ),


    # =========================
    # PYTHON
    # =========================

    (
        "What is Python commonly used for?",
        "Python is used for automation, backend development, data science, and AI.",
        "Programming",
        "Python"
    ),
    (
        "What is a Python list?",
        "A list is an ordered and mutable collection of items.",
        "Programming",
        "Python"
    ),
    (
        "What is a Python dictionary?",
        "A dictionary stores data as key-value pairs.",
        "Programming",
        "Python"
    ),
    (
        "What is a function in Python?",
        "A function is reusable code that performs a specific task.",
        "Programming",
        "Python"
    ),
    (
        "What is object-oriented programming?",
        "It organizes code using objects that contain data and behavior.",
        "Programming",
        "Python"
    ),


    # =========================
    # SYSTEM DESIGN
    # =========================

    (
        "What is system design?",
        "System design is the process of planning a software system architecture.",
        "Software Engineering",
        "System Design"
    ),
    (
        "What is horizontal scaling?",
        "Horizontal scaling adds more machines or instances to handle increased load.",
        "Software Engineering",
        "System Design"
    ),
    (
        "What is vertical scaling?",
        "Vertical scaling increases the resources of an existing machine.",
        "Software Engineering",
        "System Design"
    ),
    (
        "What is a load balancer?",
        "A load balancer distributes incoming traffic across multiple servers.",
        "Software Engineering",
        "System Design"
    ),
    (
        "What is caching?",
        "Caching stores frequently used data for faster future access.",
        "Software Engineering",
        "System Design"
    ),


    # =========================
    # COMMUNICATION
    # =========================

    (
        "What is active listening?",
        "Active listening means fully focusing on and understanding the speaker.",
        "Communication",
        "Communication"
    ),
    (
        "What is constructive feedback?",
        "Constructive feedback provides useful suggestions for improvement.",
        "Communication",
        "Communication"
    ),
    (
        "Why is clear communication important?",
        "It reduces misunderstandings and improves collaboration.",
        "Communication",
        "Communication"
    ),
    (
        "What is stakeholder communication?",
        "It is sharing relevant information with people involved in a project.",
        "Communication",
        "Communication"
    ),
    (
        "What is effective team communication?",
        "It involves clear, respectful, and timely sharing of information.",
        "Communication",
        "Communication"
    ),


    # =========================
    # AGILE & SCRUM
    # =========================

    (
        "What is Agile?",
        "Agile is an iterative approach focused on collaboration and continuous improvement.",
        "Project Management",
        "Agile & Scrum"
    ),
    (
        "What is Scrum?",
        "Scrum is an Agile framework used to manage work in short iterations.",
        "Project Management",
        "Agile & Scrum"
    ),
    (
        "What is a sprint?",
        "A sprint is a fixed period during which a team completes planned work.",
        "Project Management",
        "Agile & Scrum"
    ),
    (
        "What is a product backlog?",
        "A product backlog is a prioritized list of work and requirements.",
        "Project Management",
        "Agile & Scrum"
    ),
    (
        "Who is the Scrum Master?",
        "The Scrum Master helps the team follow Scrum practices and removes obstacles.",
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
from ..database.models import LearningResource, Skill


def calculate_skill_gaps(student, career):
    student_levels = {}

    for assessment in student.skill_assessments:
        student_levels[assessment.skill_id] = assessment.level

    gaps = []

    for requirement in career.required_skills:
        current_level = student_levels.get(requirement.skill_id, 0)
        required_level = requirement.required_level

        gap = max(required_level - current_level, 0)

        if gap > 0:
            gaps.append({
                "skill_id": requirement.skill_id,
                "skill_name": requirement.skill.name,
                "current": current_level,
                "required": required_level,
                "gap": gap
            })

    gaps.sort(
        key=lambda x: x["gap"],
        reverse=True
    )

    return gaps


def calculate_readiness(student, career):
    student_levels = {}

    for assessment in student.skill_assessments:
        student_levels[assessment.skill_id] = assessment.level

    if not career.required_skills:
        return 0

    total_score = 0
    total_possible = 0

    for requirement in career.required_skills:
        current_level = student_levels.get(requirement.skill_id, 0)
        required_level = requirement.required_level

        total_score += min(current_level, required_level)
        total_possible += required_level

    score = (total_score / total_possible) * 100

    return round(score, 2)


def get_recommended_resources(db, student, career):
    gaps = calculate_skill_gaps(student, career)

    recommendations = []

    for gap in gaps:
        skill_id = gap["skill_id"]

        resources = db.query(LearningResource).filter(
            LearningResource.skill_id == skill_id
        ).all()

        for resource in resources:
            recommendations.append({
                "id": resource.id,
                "url": resource.url,
                "title": resource.title,
                "description": resource.description,
                "type": resource.resource_type,
                "provider": resource.provider,
                "duration": resource.duration,
                "difficulty": resource.difficulty,
                "skill": gap["skill_name"]
            })

    return recommendations
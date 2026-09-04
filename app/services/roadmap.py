def create_roadmap(skill_gaps, resources):
    roadmap = []

    for index, gap in enumerate(skill_gaps):
        skill_name = gap["skill_name"]

        matching_resources = [
            resource
            for resource in resources
            if resource["skill"] == skill_name
        ]

        if matching_resources:
            resource = matching_resources[0]

            roadmap.append({
                "id": resource["id"],
                "title": resource["title"],
                "duration": resource["duration"],
                "targetSkill": skill_name,
                "currentLevel": gap["current"],
                "requiredLevel": gap["required"],
                "gap": gap["gap"],
                "step": index + 1
            })

    return roadmap



import json
from .llama_agent import generate_subtopics
from .fallback_data import load_curated_data
from .fetchers import fetch_youtube_links, fetch_github_projects
from .hardcoded_roadmaps import get_hardcoded_roadmap, is_skill_hardcoded

def build_roadmap_for_skill(skill: str):
    """
    Build roadmap for a skill.
    First checks if hardcoded roadmap exists, otherwise generates dynamically.
    """
    # Check if hardcoded roadmap exists for this skill
    if is_skill_hardcoded(skill):
        hardcoded = get_hardcoded_roadmap(skill)
        return {
            "main_course": skill,
            "is_hardcoded": True,
            "duration_weeks": hardcoded.get("totalDays", 60) // 7,
            "description": hardcoded.get("description", ""),
            "phases": hardcoded.get("phases", []),
            "projects": hardcoded.get("projects", [])
        }
    
    # Fallback to dynamic generation
    try:
        subtopics = generate_subtopics(skill)
    except Exception as e:
        print(f"⚠️ Could not generate subtopics for {skill}: {e}")
        subtopics = [
            f"Fundamentals of {skill}",
            f"Intermediate {skill} Concepts",
            f"Advanced {skill} Topics",
            f"Practical Projects in {skill}"
        ]

    final_output = {
        "main_course": skill,
        "is_hardcoded": False,
        "duration_weeks": 8,
        "subtopics": [],
        "final_projects": {
            "suggested": [
                f"Build a complete mini-project using {skill}",
                f"Create a portfolio-level project in {skill}"
            ],
            "github_references": []
        }
    }

    for topic in subtopics:
        final_output["subtopics"].append({
            "title": topic,
            "youtube_links": [],
            "project": f"Mini project based on {topic}"
        })

    return final_output


def build_roadmap_for_skills(skills: list[str]) -> dict:
    """
    Build roadmaps for multiple skills.
    Prioritizes hardcoded roadmaps for better quality.
    """
    result = {}
    for skill in skills:
        result[skill] = build_roadmap_for_skill(skill)
    return result



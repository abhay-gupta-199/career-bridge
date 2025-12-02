


import json
from .llama_agent import generate_subtopics
from .fallback_data import load_curated_data
from .fetchers import fetch_youtube_links, fetch_github_projects

def build_roadmap_for_skill(skill: str):

    subtopics = generate_subtopics(skill)

    final_output = {
        "main_course": skill,
        "duration_weeks": 8,
        "subtopics": [],
        "final_projects": {
            "suggested": [
                f"Build a complete mini-project using {skill}",
                f"Create a portfolio-level project in {skill}"
            ],
            "github_references": fetch_github_projects(skill, max_results=3)
        }
    }

    for topic in subtopics:
        final_output["subtopics"].append({
            "title": topic,
            "youtube_links": fetch_youtube_links(query=topic, max_results=3),
            "project": f"Mini project based on {topic}"
        })

    return final_output


def build_roadmap_for_skills(skills: list[str]) -> dict:
    return {skill: build_roadmap_for_skill(skill) for skill in skills}




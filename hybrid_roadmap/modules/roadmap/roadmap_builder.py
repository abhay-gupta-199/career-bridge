import json
from .fallback_data import load_curated_data
from .llama_agent import generate_roadmap_with_ai
from .fetchers import fetch_youtube_links, fetch_github_projects

def build_roadmap_for_skill(skill: str) -> dict:
    curated = load_curated_data()
    # 1) Curated if available
    if skill in curated:
        roadmap = curated[skill]
    else:
        # 2) AI generate if not curated
        ai_raw = generate_roadmap_with_ai(skill)
        try:
            roadmap = json.loads(ai_raw)
        except Exception:
            # emergency fallback
            roadmap = {
                "phases": [
                    {
                        "title": f"{skill} Basics",
                        "topics": ["Fundamentals", "Setup", "Hello World"],
                        "duration_weeks": 2,
                        "project": f"Mini project using {skill}"
                    }
                ]
            }

    # 3) Enrich with external resources
    for phase in roadmap.get("phases", []):
        phase["external_resources"] = {
            "YouTube": fetch_youtube_links(skill),
            "GitHub": fetch_github_projects(skill)
        }
    return roadmap

def build_roadmap_for_skills(skills: list[str]) -> dict:
    return {s: build_roadmap_for_skill(s) for s in skills}

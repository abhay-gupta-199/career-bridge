
import json
import os

def load_curated_data() -> dict:
    path = os.path.join("data", "curated_roadmaps.json")
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def FALLBACK_BASIC_TEMPLATE(skill: str):
    return {
        "phases": [
            {
                "title": f"{skill} Foundations",
                "topics": ["Overview", f"What is {skill}?", "Where is it used?"],
                "duration_weeks": 1,
                "project": f"Intro project in {skill}"
            }
        ]
    }


import re
import pandas as pd
from .skill_extractor import extract_skills

def weight_jd_skills(jd_text: str, all_skills: list[str]) -> dict[str, int]:
    t = jd_text.lower()
    weights: dict[str, int] = {}

    sections = [
        (3, r"(must have|required)(.*?)(?=good to have|preferred|nice to have|optional|$)"),
        (2, r"(good to have|preferred|nice to have)(.*?)(?=must have|required|optional|$)"),
        (1, r"(optional)(.*?)(?=must have|required|good to have|preferred|nice to have|$)")
    ]
    for w, pat in sections:
        for m in re.finditer(pat, t, flags=re.DOTALL):
            window = m.group(0)
            for skill in all_skills:
                if re.search(rf"\b{re.escape(skill.lower())}\b", window):
                    weights[skill] = max(weights.get(skill, 0), w)

    # fallback: any other mention = weight 2
    for skill in all_skills:
        if re.search(rf"\b{re.escape(skill.lower())}\b", t) and skill not in weights:
            weights[skill] = 2

    return dict(sorted(weights.items()))

def parse_jd(jd_text: str, skills_csv_path: str) -> dict[str, int]:
    df = pd.read_csv(skills_csv_path)
    all_skills = df["skill"].dropna().tolist()
    return weight_jd_skills(jd_text, all_skills)

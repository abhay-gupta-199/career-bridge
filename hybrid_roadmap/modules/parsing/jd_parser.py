import csv
import re
from .skill_extractor import extract_skills

SECTION_PATTERNS = [
    (3, r"(technical skills|skills & technologies|skills and technologies|tech stack|technology stack|core competencies|competencies)(.*?)(?=(experience|education|projects|certifications|about|responsibilities|qualifications|requirements|$))"),
    (3, r"(must have|required|essential|mandatory|min(?:imum)? qualifications|min(?:imum)? requirements|required qualifications)(.*?)(?=(good to have|preferred|nice to have|optional|responsibilities|qualifications|$))"),
    (2, r"(good to have|preferred|nice to have|optional|nice-to-have|desired skills)(.*?)(?=(must have|required|essential|mandatory|responsibilities|qualifications|$))"),
]

CONTEXT_PATTERNS = [
    (2, r"(experience with|proficiency in|knowledge of|familiarity with|working knowledge of|hands-on experience with|strong experience in|solid experience with)([\s\S]{0,200})"),
    (2, r"(experience in|expertise in|skilled in|skill in)([\s\S]{0,200})"),
]


def _load_skills(skills_csv_path: str) -> list[str]:
    skills = []
    with open(skills_csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        next(reader, None)
        for row in reader:
            if not row or not row[0].strip():
                continue
            skills.append(row[0].strip())
    return skills


def _normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def _find_section_text(text: str, pattern: str) -> list[str]:
    return [match.group(2) for match in re.finditer(pattern, text, flags=re.IGNORECASE | re.DOTALL)]


def weight_jd_skills(jd_text: str, all_skills: list[str]) -> dict[str, int]:
    t = _normalize_text(jd_text)
    weights: dict[str, int] = {}

    # Weight skills found in explicit sections first
    for weight, pattern in SECTION_PATTERNS:
        for section in _find_section_text(t, pattern):
            for skill in extract_skills(section, all_skills):
                weights[skill] = max(weights.get(skill, 0), weight)

    # Look for skills in nearby context phrases if not already weighted
    for weight, pattern in CONTEXT_PATTERNS:
        for context in _find_section_text(t, pattern):
            for skill in extract_skills(context, all_skills):
                weights[skill] = max(weights.get(skill, 0), weight)

    # Final fallback: any mention in full JD text gets lowest priority
    all_found = extract_skills(t, all_skills)
    for skill in all_found:
        weights[skill] = max(weights.get(skill, 0), 1)

    return dict(sorted(weights.items(), key=lambda item: (-item[1], item[0])))


def parse_jd(jd_text: str, skills_csv_path: str) -> dict[str, int]:
    all_skills = _load_skills(skills_csv_path)
    return weight_jd_skills(jd_text, all_skills)

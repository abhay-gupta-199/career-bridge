import re


def _skill_pattern(skill: str) -> str:
    escaped = re.escape(skill.lower())
    # Allow common separators such as spaces, hyphens, slashes, and periods.
    escaped = escaped.replace(r'\ ', r'[\s\-/]+')
    return escaped


def extract_skills(text: str, skill_list: list[str]) -> list[str]:
    text_l = text.lower()
    clean = re.sub(r'[^a-z0-9+#./\-\s]', ' ', text_l)
    clean = re.sub(r'\s+', ' ', clean)
    found = set()
    for skill in skill_list:
        s = skill.lower().strip()
        if not s:
            continue
        pattern = rf'(?<!\w){_skill_pattern(s)}(?!\w)'
        if re.search(pattern, clean):
            found.add(skill)
    return sorted(list(found))

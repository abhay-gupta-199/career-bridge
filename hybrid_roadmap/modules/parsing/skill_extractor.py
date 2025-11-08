import re

def extract_skills(text: str, skill_list: list[str]) -> list[str]:
    text_l = text.lower()
    clean = re.sub(r'[^a-z0-9+#.\s]', ' ', text_l)
    clean = re.sub(r'\s+', ' ', clean)
    found = set()
    for skill in skill_list:
        s = skill.lower().strip()
        if not s:
            continue
        pattern = rf'\b{re.escape(s)}\b'
        if re.search(pattern, clean):
            found.add(skill)
    return sorted(list(found))

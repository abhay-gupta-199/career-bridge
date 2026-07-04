import os
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


# ----------- LOAD SEMANTIC MODEL -------------
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def _normalize_skills(skills: list[str]) -> tuple[list[str], dict[str, str], dict[str, str]]:
    """Return normalized lower-case skills plus original case maps for both resume and JD."""
    resume_map = {skill.lower(): skill for skill in skills}
    normalized = [skill.lower().strip() for skill in skills if skill and isinstance(skill, str)]
    return normalized, resume_map, {skill.lower(): skill for skill in skills}


def _build_overlap_score(resume_set: set[str], jd_set: set[str], jd_skill_weights: dict[str, float] | None = None) -> float:
    if not jd_set:
        return 0.0

    if jd_skill_weights:
        matched_weight = sum(jd_skill_weights.get(skill, 0.0) for skill in resume_set.intersection(jd_set))
        total_weight = sum(jd_skill_weights.get(skill, 1.0) for skill in jd_set) or 1.0
        return round(matched_weight / total_weight, 4)

    matched_count = len(resume_set.intersection(jd_set))
    return round(matched_count / len(jd_set), 4)


def _format_skill_list(skill_set: set[str], resume_case_map: dict[str, str], jd_case_map: dict[str, str]) -> list[str]:
    formatted = []
    for skill in sorted(skill_set):
        formatted.append(jd_case_map.get(skill, resume_case_map.get(skill, skill)))
    return formatted


def match_resume_jd_semantic(resume_skills: list[str], jd_skills: list[str], jd_skill_weights: dict[str, float] | None = None):
    """
    Compare resume skills and JD skills using multiple signals:
    1. exact overlap match score (case-insensitive)
    2. semantic similarity via sentence-transformer embeddings
    3. TF-IDF similarity over skill text

    The hybrid score blends all signals for more stable and efficient scoring.
    """
    resume_lower, resume_original, _ = _normalize_skills(resume_skills)
    jd_lower, _, jd_original = _normalize_skills(jd_skills)

    resume_text = " ".join(resume_skills)
    jd_text = " ".join(jd_skills)

    # ------------- SEMANTIC SIMILARITY -------------
    resume_emb = model.encode([resume_text])
    jd_emb = model.encode([jd_text])
    semantic_score = float(cosine_similarity(resume_emb, jd_emb)[0][0])

    # ------------- TF-IDF SIMILARITY -------------
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume_text.lower(), jd_text.lower()])
    tfidf_score = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])

    # ------------- EXACT OVERLAP SCORE -------------
    resume_set = set(resume_lower)
    jd_set = set(jd_lower)
    overlap_score = _build_overlap_score(resume_set, jd_set, jd_skill_weights)

    # ------------- HYBRID SCORE -------------
    # combine semantic, tfidf and exact overlap for a more robust metric
    hybrid_score = round(0.45 * semantic_score + 0.35 * tfidf_score + 0.20 * overlap_score, 4)

    matched_lower = resume_set.intersection(jd_set)
    missing_lower = jd_set - resume_set

    matched_skills = _format_skill_list(matched_lower, resume_original, jd_original)
    missing_skills = _format_skill_list(missing_lower, resume_original, jd_original)

    match_percentage = round(overlap_score * 100, 2)

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "semantic_score": round(semantic_score, 4),
        "tfidf_score": round(tfidf_score, 4),
        "overlap_score": round(overlap_score, 4),
        "hybrid_score": hybrid_score,
        "match_percentage": match_percentage
    }

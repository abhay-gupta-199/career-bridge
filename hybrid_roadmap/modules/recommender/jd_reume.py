import os
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


# ----------- LOAD SEMANTIC MODEL -------------
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


# ----------- MATCH RESUME WITH ONE JD -------------
def match_resume_jd_semantic(resume_skills: list[str], jd_skills: list[str]):
    """
    This function compares RESUME skills with JD skills using:
    1. Sentence Transformer Embeddings (Semantic Similarity)
    2. TF-IDF Similarity
    3. Hybrid scoring (70% semantic + 30% tf-idf)
    """

    # Convert skills to text
    resume_text = " ".join(resume_skills)
    jd_text = " ".join(jd_skills)

    # ------------- SEMANTIC SIMILARITY -------------
    resume_emb = model.encode([resume_text])
    jd_emb = model.encode([jd_text])
    semantic_score = float(cosine_similarity(resume_emb, jd_emb)[0][0])

    # ------------- TF-IDF SIMILARITY -------------
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])  # index 0=res, 1=jd
    tfidf_score = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])

    # ------------- FINAL HYBRID SCORE -------------
    final_score = round(0.7 * semantic_score + 0.3 * tfidf_score, 4)

    # ------------- SKILL OVERLAP -------------
    resume_set = set([s.lower() for s in resume_skills])
    jd_set = set([s.lower() for s in jd_skills])

    matched = list(resume_set.intersection(jd_set))
    missing = list(jd_set - resume_set)

    match_percent = round((len(matched) / len(jd_set)) * 100, 2) if len(jd_set) else 0

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "semantic_score": round(semantic_score, 4),
        "tfidf_score": round(tfidf_score, 4),
        "hybrid_score": final_score,
        "match_percentage": match_percent
    }

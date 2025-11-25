import json
import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


def load_sample_jobs():
    base_dir = os.path.dirname(__file__)
    json_path = os.path.join(base_dir, "sample_jds.json")
    with open(json_path, "r") as f:
        return json.load(f)


model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def recommend_jobs_semantic(resume_skills: list[str], top_n: int = 3):
    jobs = load_sample_jobs()

    resume_text = " ".join(resume_skills)
    job_texts = [job["description"] for job in jobs]

    resume_emb = model.encode([resume_text])
    job_embs = model.encode(job_texts)

    semantic_scores = cosine_similarity(resume_emb, job_embs)[0]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume_text] + job_texts)
    tfidf_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]

    final_scores = 0.7 * semantic_scores + 0.3 * tfidf_scores

    job_scores = []
    for job, score in zip(jobs, final_scores):
        job_scores.append({
            "id": job["id"],
            "title": job["title"],
            "description": job["description"],
            "score": round(float(score), 4)
        })

    job_scores.sort(key=lambda x: x["score"], reverse=True)
    return job_scores[:top_n]

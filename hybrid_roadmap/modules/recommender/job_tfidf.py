import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def load_sample_jobs():
    base_dir = os.path.dirname(__file__)
    json_path = os.path.join(base_dir, "sample_jds.json")

    with open(json_path, "r") as f:
        return json.load(f)


def recommend_jobs(resume_skills: list[str], top_n: int = 3):
    jobs = load_sample_jobs()

    resume_text = " ".join(resume_skills)

    job_texts = [job["description"] for job in jobs]
    corpus = [resume_text] + job_texts

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]

    job_scores = []
    for job, score in zip(jobs, similarities):
        job_scores.append({
            "id": job["id"],
            "title": job["title"],
            "description": job["description"],
            "score": round(float(score), 4)
        })

    job_scores.sort(key=lambda x: x["score"], reverse=True)

    return job_scores[:top_n]

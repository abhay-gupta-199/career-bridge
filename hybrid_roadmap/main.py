import os
import json
from modules.parsing.resume_parser import parse_resume
from modules.parsing.jd_parser import parse_jd
from modules.roadmap.roadmap_builder import build_roadmap_for_skills
from modules.recommender.job_semantic import recommend_jobs_semantic


def ats_skill_pipeline(resume_path: str, jd_text: str, skills_csv_path: str) -> dict:
    """Main ATS pipeline: extract resume skills, compare with JD, compute score & roadmap."""

    # ✅ Ensure the file exists before processing
    if not os.path.exists(resume_path):
        raise FileNotFoundError(f"❌ Resume file not found: {resume_path}")

    if not os.path.exists(skills_csv_path):
        raise FileNotFoundError(f"❌ Skills CSV file not found: {skills_csv_path}")

    # 🧠 Parse resume & JD
    resume_skills = parse_resume(resume_path, skills_csv_path)
    jd_skills_with_weights = parse_jd(jd_text, skills_csv_path)

    jd_skills = list(jd_skills_with_weights.keys())
    resume_set = set(s.lower() for s in resume_skills)
    matched = [s for s in jd_skills if s.lower() in resume_set]
    missing = [s for s in jd_skills if s.lower() not in resume_set]

    # 📊 Calculate ATS score
    total_weight = sum(jd_skills_with_weights.values()) or 1
    matched_weight = sum(jd_skills_with_weights[s] for s in matched)
    ats_score = round((matched_weight / total_weight) * 100, 2)

    # 🧩 Generate roadmap for missing skills
    roadmap = build_roadmap_for_skills(missing)

    # Job recommendations
    jobs = recommend_jobs_semantic(matched)

    return {
        "resume_skills": resume_skills,
        "jd_skills": jd_skills_with_weights,
        "matched_skills": matched,
        "missing_skills": missing,
        "ats_score": ats_score,
        "jobs_recommendations": jobs,
        "roadmap": roadmap
    }


if __name__ == "__main__":
    # 📍 Detect base directory automatically (no need to hardcode paths)
    BASE_DIR = os.path.dirname(__file__)

    jd_text = """
    We are hiring a Data Analyst.
    Must have: Python, SQL, Excel.
    Good to have: Tableau, Power BI, Git.
    Optional: Docker
    """

    # ✅ Build full paths dynamically
    resume_path = os.path.join(BASE_DIR, "Bhoomika_agrawal.resume.pdf")
    skills_csv_path = os.path.join(BASE_DIR, "data", "skills.csv")

    result = ats_skill_pipeline(
        resume_path=resume_path,
        jd_text=jd_text,
        skills_csv_path=skills_csv_path
    )

    print(json.dumps(result, indent=4, ensure_ascii=False))

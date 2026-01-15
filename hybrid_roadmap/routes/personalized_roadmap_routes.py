"""
Personalized Job Roadmap Routes
Endpoint for generating AI-powered, time-aware learning roadmaps for specific jobs
"""

from flask import Blueprint, request, jsonify
from modules.roadmap.personalized_roadmap import build_personalized_job_roadmap

personalized_roadmap_bp = Blueprint("personalized_roadmap", __name__)


@personalized_roadmap_bp.route("/personalized-job-roadmap", methods=["POST"])
def generate_personalized_job_roadmap():
    """
    Generate a personalized learning roadmap for a specific job.
    
    Request body:
    {
        "resume_skills": ["Python", "React", "SQL"],
        "jd_skills": ["Python", "Node.js", "MongoDB", "AWS", "Docker"],
        "jd_skill_weights": {"Python": 3, "Node.js": 3, "MongoDB": 2, ...},  # Optional
        "deadline": "2026-03-15" or 45,  # ISO date or days remaining
        "job_title": "Backend Developer",  # Optional, for context
        "company": "TechCorp"  # Optional, for context
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        resume_skills = data.get("resume_skills", [])
        jd_skills = data.get("jd_skills", [])
        
        if not isinstance(resume_skills, list):
            return jsonify({"error": "resume_skills must be a list"}), 400
        
        if not isinstance(jd_skills, list):
            return jsonify({"error": "jd_skills must be a list"}), 400
        
        if len(jd_skills) == 0:
            return jsonify({"error": "jd_skills cannot be empty"}), 400
        
        # Optional fields
        jd_skill_weights = data.get("jd_skill_weights", {})
        deadline = data.get("deadline", None)
        job_title = data.get("job_title", "Unknown Job")
        company = data.get("company", "Unknown Company")
        
        # Validate deadline if provided
        days_fallback = 30
        if deadline:
            if isinstance(deadline, (int, float)):
                if deadline <= 0:
                    return jsonify({"error": "deadline days must be greater than 0"}), 400
                days_fallback = int(deadline)
        
        # Generate roadmap
        roadmap = build_personalized_job_roadmap(
            resume_skills=resume_skills,
            jd_skills=jd_skills,
            jd_skill_weights=jd_skill_weights,
            deadline_str=deadline,
            days_fallback=days_fallback
        )
        
        # Add job context
        roadmap["job_context"] = {
            "title": job_title,
            "company": company
        }
        
        return jsonify({
            "status": "success",
            "roadmap": roadmap
        }), 200
    
    except Exception as e:
        print(f"❌ Error generating personalized roadmap: {str(e)}")
        return jsonify({"error": str(e)}), 500


@personalized_roadmap_bp.route("/roadmap-preview", methods=["POST"])
def roadmap_preview():
    """
    Quick preview of roadmap structure without detailed AI generation.
    Useful for quick checks before detailed generation.
    """
    try:
        data = request.get_json()
        
        resume_skills = data.get("resume_skills", [])
        jd_skills = data.get("jd_skills", [])
        deadline = data.get("deadline", 30)
        
        if not jd_skills:
            return jsonify({"error": "jd_skills required"}), 400
        
        # Quick analysis without full roadmap generation
        resume_set = set(s.lower() for s in resume_skills)
        jd_set = set(s.lower() for s in jd_skills)
        
        matched = list(resume_set.intersection(jd_set))
        missing = [s for s in jd_skills if s.lower() not in resume_set]
        
        days = deadline if isinstance(deadline, int) else 30
        
        preview = {
            "status": "success",
            "summary": {
                "matched_count": len(matched),
                "missing_count": len(missing),
                "match_percentage": round((len(matched) / len(jd_skills) * 100), 2) if jd_skills else 0,
                "days_available": days,
                "parallel_streams": min(3, max(1, len(missing) // 2))
            },
            "missing_skills": missing,
            "matched_skills": matched,
            "estimated_learning_hours": len(missing) * 40  # ~40 hours per skill avg
        }
        
        return jsonify(preview), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

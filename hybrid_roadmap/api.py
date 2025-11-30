from flask import Flask, request, jsonify
from flask_cors import CORS
from modules.parsing.jd_parser import parse_jd
from modules.parsing.resume_parser import parse_resume
from modules.recommender.jd_reume import  match_resume_jd_semantic
from modules.recommender.job_semantic import recommend_jobs_semantic
from routes.roadmap_routes import roadmap_bp

import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# REGISTER NEW ROUTE
app.register_blueprint(roadmap_bp, url_prefix="/api")


SKILLS_CSV = "data/skills.csv"


@app.route("/parse-jd", methods=["POST"])
def parse_jd_route():
    try:
        data = request.get_json()

        if not data or "jd_text" not in data:
            return jsonify({"error": "jd_text is required"}), 400

        jd_text = data["jd_text"]

        jd_skill_weights = parse_jd(jd_text, SKILLS_CSV)

        return jsonify({
            "status": "success",
            "jd_skill_weights": jd_skill_weights
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/parse-resume", methods=["POST"])
def parse_resume_route():
    try:
        if "file" not in request.files:
            return jsonify({"error": "Upload a PDF or DOCX resume"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        resume_skills = parse_resume(file_path, SKILLS_CSV)

        return jsonify({
            "status": "success",
            "resume_skills": resume_skills
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route("/match-jd-resume", methods=["POST"])
def match_jd_resume():
    try:
     
        if "file" not in request.files:
            return jsonify({"error": "Upload a resume file (.pdf or .docx)"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

      
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

      
        resume_skills = parse_resume(file_path, SKILLS_CSV)

      
        jd_text = request.form.get("jd_text")
        if not jd_text:
            return jsonify({"error": "jd_text is required"}), 400

       
        jd_skill_weights = parse_jd(jd_text, SKILLS_CSV)
        jd_skills = list(jd_skill_weights.keys())


        match_result = match_resume_jd_semantic(resume_skills, jd_skills)

    
        return jsonify({
            "status": "success",
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "match_result": match_result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/match-skills", methods=["POST"])
def match_skills():
    """
    Match student skills with JD skills directly (no file upload needed)
    Expects JSON: { "resume_skills": [...], "jd_skills": [...] }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "JSON data required"}), 400
        
        resume_skills = data.get("resume_skills", [])
        jd_skills = data.get("jd_skills", [])
        
        if not resume_skills or not isinstance(resume_skills, list):
            return jsonify({"error": "resume_skills must be a non-empty list"}), 400
        
        if not jd_skills or not isinstance(jd_skills, list):
            return jsonify({"error": "jd_skills must be a non-empty list"}), 400
        
        match_result = match_resume_jd_semantic(resume_skills, jd_skills)
        
        return jsonify({
            "status": "success",
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "match_result": match_result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route("/full-process", methods=["POST"])
def full_process_route():
    try:
       
        if "file" not in request.files:
            return jsonify({"error": "Upload a resume file"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

    
        resume_skills = parse_resume(file_path, SKILLS_CSV)


        jd_text = request.form.get("jd_text")
        jd_skills = None
        match_result = None

        if jd_text:
            jd_skill_weights = parse_jd(jd_text, SKILLS_CSV)
            jd_skills = list(jd_skill_weights.keys())
            match_result = match_resume_jd_semantic(resume_skills, jd_skills)

      
        recommended_jobs = recommend_jobs_semantic(resume_skills, top_n=5)

        return jsonify({
            "status": "success",
            "resume_skills": resume_skills,
            "jd_skills": jd_skills,
            "match_result": match_result,
            "recommended_jobs": recommended_jobs
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5003))
    app.run(debug=True, host='0.0.0.0', port=port)

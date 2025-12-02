
from flask import Blueprint, request, jsonify
from modules.roadmap.roadmap_builder import build_roadmap_for_skills

roadmap_bp = Blueprint("roadmap_bp", __name__)

@roadmap_bp.route("/generate-roadmap", methods=["POST"])
def generate_roadmap():
    try:
        data = request.get_json()
        if not data or "skills" not in data:
            return jsonify({"error": "skills list is required"}), 400
        
        result = build_roadmap_for_skills(data["skills"])

        return jsonify({
            "status": "success",
            "roadmap": result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


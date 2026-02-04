"""
ENHANCED ATS SKILL PIPELINE WITH HYBRID JOB MATCHING
Combines:
1. Resume & JD Parsing
2. Skill Extraction & Comparison
3. ATS Score Calculation
4. Hybrid Job Recommendations (Semantic + TF-IDF)
5. Personalized Roadmap Generation
"""

import os
import json
from modules.parsing.resume_parser import parse_resume
from modules.parsing.jd_parser import parse_jd
from modules.roadmap.roadmap_builder import build_roadmap_for_skills
from modules.recommender.hybrid_matcher import HybridJobMatcher


def ats_skill_pipeline(resume_path: str, jd_text: str, skills_csv_path: str) -> dict:
    """
    Enhanced ATS pipeline with hybrid job matching
    
    Process:
    1. Parse resume to extract skills
    2. Parse job description to extract required skills
    3. Calculate ATS score (skill match percentage)
    4. Generate learning roadmaps for missing skills
    5. Recommend similar jobs using hybrid matching (70% semantic + 30% TF-IDF)
    
    Args:
        resume_path: Path to resume file (PDF/DOCX)
        jd_text: Job description text
        skills_csv_path: Path to skills database CSV
    
    Returns:
        Dictionary with:
        - resume_skills: Extracted skills from resume
        - jd_skills: Required skills with weights
        - matched_skills: Skills student has
        - missing_skills: Skills to develop
        - ats_score: Overall match percentage
        - hybrid_recommendations: Similar job recommendations
        - roadmap: Learning paths for missing skills
    """
    
    # ✅ Validate files exist
    if not os.path.exists(resume_path):
        raise FileNotFoundError(f"❌ Resume file not found: {resume_path}")

    if not os.path.exists(skills_csv_path):
        raise FileNotFoundError(f"❌ Skills CSV file not found: {skills_csv_path}")

    print("\n" + "="*80)
    print("🚀 STARTING HYBRID ATS SKILL PIPELINE")
    print("="*80)

    # Step 1: Parse resume and extract skills
    print("\n📄 Step 1: Parsing Resume...")
    resume_skills = parse_resume(resume_path, skills_csv_path)
    print(f"✅ Found {len(resume_skills)} skills in resume: {resume_skills}")

    # Step 2: Parse job description and extract required skills
    print("\n📋 Step 2: Parsing Job Description...")
    jd_skills_with_weights = parse_jd(jd_text, skills_csv_path)
    print(f"✅ Found {len(jd_skills_with_weights)} required skills")
    for skill, weight in jd_skills_with_weights.items():
        print(f"   - {skill}: {weight} (weight)")

    # Step 3: Calculate match analysis
    print("\n🔍 Step 3: Skill Matching Analysis...")
    jd_skills = list(jd_skills_with_weights.keys())
    matched = [s for s in jd_skills if s in resume_skills]
    missing = [s for s in jd_skills if s not in resume_skills]
    
    print(f"✅ Matched Skills: {len(matched)}/{len(jd_skills)}")
    if matched:
        for skill in matched:
            print(f"   ✓ {skill}")
    
    print(f"\n❌ Missing Skills: {len(missing)}/{len(jd_skills)}")
    if missing:
        for skill in missing:
            print(f"   ✗ {skill}")

    # Step 4: Calculate ATS Score (Weighted skill match)
    print("\n📊 Step 4: Calculating ATS Score...")
    total_weight = sum(jd_skills_with_weights.values()) or 1
    matched_weight = sum(jd_skills_with_weights[s] for s in matched)
    ats_score = round((matched_weight / total_weight) * 100, 2)
    
    print(f"✅ ATS Score: {ats_score}%")
    print(f"   Matched Weight: {matched_weight}")
    print(f"   Total Weight: {total_weight}")

    # Step 5: Generate roadmap for missing skills
    print("\n🛤️  Step 5: Generating Learning Roadmap...")
    roadmap = build_roadmap_for_skills(missing)
    print(f"✅ Roadmap created for {len(missing)} missing skills")

    # Step 6: Get hybrid job recommendations
    print("\n🤖 Step 6: Getting Hybrid Job Recommendations...")
    matcher = HybridJobMatcher()
    hybrid_results = matcher.recommend_jobs_hybrid(resume_skills, top_n=5)
    
    print(f"✅ Found {hybrid_results['total_jobs']} total jobs")
    print(f"✅ Top 5 Recommendations:")
    for match in hybrid_results['matches']:
        print(f"   {match['rank']}. {match['title']} - {match['match_percentage']}% match")

    print("\n" + "="*80)

    # Compile final result
    final_result = {
        "pipeline_status": "success",
        "resume_skills": resume_skills,
        "jd_skills": jd_skills_with_weights,
        "skill_analysis": {
            "total_required": len(jd_skills),
            "matched": len(matched),
            "matched_skills": matched,
            "missing": len(missing),
            "missing_skills": missing,
            "match_count": f"{len(matched)}/{len(jd_skills)}"
        },
        "ats_score": ats_score,
        "ats_score_details": {
            "score_percentage": ats_score,
            "matched_weight": round(float(matched_weight), 2),
            "total_weight": round(float(total_weight), 2),
            "interpretation": get_ats_interpretation(ats_score)
        },
        "hybrid_job_recommendations": {
            "total_jobs_analyzed": hybrid_results['total_jobs'],
            "top_recommendations": hybrid_results['matches'],
            "matching_method": "Hybrid (70% Semantic + 30% TF-IDF)"
        },
        "roadmap": roadmap
    }

    return final_result


def get_ats_interpretation(ats_score: float) -> str:
    """Provide interpretation of ATS score"""
    if ats_score >= 90:
        return "Excellent - Perfect candidate for this role"
    elif ats_score >= 75:
        return "Good - Well-qualified with minor skill gaps"
    elif ats_score >= 60:
        return "Fair - Qualified but needs to develop several skills"
    elif ats_score >= 40:
        return "Below Average - Significant skill gaps, heavy learning required"
    else:
        return "Poor - Major skill gaps, may not be suitable"


def print_results_formatted(results: dict):
    """Pretty print pipeline results"""
    print("\n" + "="*80)
    print("📊 COMPLETE PIPELINE RESULTS")
    print("="*80 + "\n")

    # Resume Skills
    print("📄 RESUME ANALYSIS")
    print("-" * 80)
    print(f"Skills Found: {len(results['resume_skills'])}")
    for skill in results['resume_skills']:
        print(f"  ✓ {skill}")

    # Skill Gap Analysis
    print("\n\n🎯 SKILL GAP ANALYSIS")
    print("-" * 80)
    analysis = results['skill_analysis']
    print(f"Required Skills: {analysis['total_required']}")
    print(f"Matched: {analysis['matched']} ✓")
    print(f"Missing: {analysis['missing']} ✗")
    print(f"Overall Match: {analysis['match_count']}")

    if analysis['matched_skills']:
        print(f"\nMatched Skills:")
        for skill in analysis['matched_skills']:
            print(f"  ✓ {skill}")

    if analysis['missing_skills']:
        print(f"\nMissing Skills (To Develop):")
        for skill in analysis['missing_skills']:
            print(f"  ✗ {skill}")

    # ATS Score
    print("\n\n📈 ATS SCORE ANALYSIS")
    print("-" * 80)
    ats_details = results['ats_score_details']
    print(f"ATS Score: {ats_details['score_percentage']}%")
    print(f"Interpretation: {ats_details['interpretation']}")
    print(f"Matched Weight: {ats_details['matched_weight']} / {ats_details['total_weight']}")

    # Job Recommendations
    print("\n\n💼 HYBRID JOB RECOMMENDATIONS")
    print("-" * 80)
    print(f"Matching Method: {results['hybrid_job_recommendations']['matching_method']}")
    print(f"Jobs Analyzed: {results['hybrid_job_recommendations']['total_jobs_analyzed']}")
    print(f"\nTop 5 Recommendations:")
    
    for match in results['hybrid_job_recommendations']['top_recommendations']:
        print(f"\n  {match['rank']}. {match['title']} at {match['company']}")
        print(f"     Match Percentage: {match['match_percentage']}%")
        print(f"     ├─ Semantic Similarity: {match['semantic_percentage']}%")
        print(f"     └─ Keyword Frequency: {match['tfidf_percentage']}%")

    # Roadmap
    if results['roadmap']:
        print("\n\n🛤️  LEARNING ROADMAP FOR MISSING SKILLS")
        print("-" * 80)
        print(f"Roadmap Created: {bool(results['roadmap'])}")
        if isinstance(results['roadmap'], dict):
            for skill, details in results['roadmap'].items():
                print(f"\n  📚 {skill.upper()}")
                if isinstance(details, dict) and 'phases' in details:
                    for phase in details.get('phases', []):
                        print(f"     • {phase.get('name', 'Unknown Phase')}")

    print("\n" + "="*80 + "\n")


if __name__ == "__main__":
    # Configure paths
    BASE_DIR = os.path.dirname(__file__)

    # Example Job Description
    jd_text = """
    We are hiring a Senior Data Analyst.
    
    Required Skills:
    - Python (Critical)
    - SQL (Critical)
    - Excel (Important)
    - Tableau (Important)
    
    Nice to Have:
    - Power BI
    - Git
    - Docker
    - Apache Spark
    
    About the Role:
    Build scalable data pipelines and analytics solutions for enterprise clients.
    """

    # Build file paths
    resume_path = os.path.join(BASE_DIR, "Bhoomika_agrawal.resume.pdf")
    skills_csv_path = os.path.join(BASE_DIR, "data", "skills.csv")

    try:
        # Run the enhanced pipeline
        result = ats_skill_pipeline(
            resume_path=resume_path,
            jd_text=jd_text,
            skills_csv_path=skills_csv_path
        )

        # Print formatted results
        print_results_formatted(result)

        # Save results to JSON
        output_path = os.path.join(BASE_DIR, "pipeline_results.json")
        with open(output_path, "w") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Results saved to {output_path}")

    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
    except Exception as e:
        print(f"❌ Pipeline failed: {e}")
        import traceback
        traceback.print_exc()

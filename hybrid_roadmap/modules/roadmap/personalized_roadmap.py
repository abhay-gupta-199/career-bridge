"""
Personalized Job Roadmap Generator
Generates detailed, time-aware learning roadmaps for specific jobs.
Uses Gemini for intelligent subtopic generation.
Implements smart parallel learning for multiple missing skills.
"""

import os
import json
import re
from datetime import datetime, timedelta
from .llama_agent import generate_subtopics


def calculate_days_until_deadline(deadline_str):
    """
    Calculate days remaining until deadline.
    Expects ISO format date string or relative days.
    """
    try:
        if isinstance(deadline_str, (int, float)):
            return int(deadline_str)
        
        deadline = datetime.fromisoformat(deadline_str)
        days_left = (deadline - datetime.now()).days
        return max(1, days_left)
    except Exception as e:
        print(f"⚠️ Warning: Could not parse deadline '{deadline_str}', using default 30 days: {e}")
        return 30


def rank_skills_by_importance(matched_skills, missing_skills, jd_skill_weights=None):
    """
    Rank missing skills by importance based on:
    1. Frequency in JD
    2. Position in requirements (must-have vs nice-to-have)
    3. Complexity estimation
    """
    ranked = []
    
    for skill in missing_skills:
        skill_lower = skill.lower()
        
        # Get weight from JD if available
        weight = 0
        if jd_skill_weights:
            weight = jd_skill_weights.get(skill, jd_skill_weights.get(skill_lower, 0))
        
        # Default weights if not in JD
        if weight == 0:
            if skill_lower in ['python', 'java', 'javascript', 'sql', 'react', 'node', 'express']:
                weight = 3  # High priority core skills
            elif skill_lower in ['aws', 'docker', 'kubernetes', 'git', 'linux']:
                weight = 2  # Medium priority infrastructure
            else:
                weight = 1  # Lower priority specialized skills
        
        ranked.append({
            'skill': skill,
            'weight': weight,
            'complexity': estimate_complexity(skill)
        })
    
    # Sort by weight (descending) then by complexity
    ranked.sort(key=lambda x: (-x['weight'], -x['complexity']))
    return ranked


def estimate_complexity(skill):
    """
    Estimate learning complexity (1-5 scale).
    Returns hours needed for basic proficiency.
    """
    skill_lower = skill.lower()
    
    complexity_map = {
        # Very hard (5)
        'machine learning': 5, 'deep learning': 5, 'tensorflow': 5, 'pytorch': 5,
        'kubernetes': 5, 'distributed systems': 5, 'system design': 5,
        
        # Hard (4)
        'aws': 4, 'azure': 4, 'gcp': 4, 'devops': 4, 'microservices': 4,
        'docker': 4, 'data engineering': 4, 'apache spark': 4,
        
        # Medium (3)
        'react': 3, 'node.js': 3, 'express': 3, 'sql': 3, 'mongodb': 3,
        'python': 3, 'java': 3, 'javascript': 3, 'rest api': 3,
        
        # Easy (2)
        'html': 2, 'css': 2, 'git': 2, 'linux': 2, 'npm': 2, 'yarn': 2,
        
        # Very easy (1)
        'communication': 1, 'problem solving': 1, 'teamwork': 1,
    }
    
    for key, value in complexity_map.items():
        if key in skill_lower:
            return value
    
    return 3  # Default medium complexity


def distribute_skills_by_time(ranked_skills, days_available):
    """
    Intelligently distribute skills across available time.
    Returns list of skill groups with timing info.
    
    Strategy:
    - If 1-2 skills: sequential focus
    - If 3-4 skills: 2 parallel + 1 sequential
    - If 5+ skills: 2-3 parallel streams
    """
    if not ranked_skills or days_available < 1:
        return []
    
    num_skills = len(ranked_skills)
    
    # Determine parallel streams
    if num_skills == 0:
        return []
    elif num_skills == 1:
        parallel_count = 1
    elif num_skills == 2:
        parallel_count = 2
    elif num_skills <= 4:
        parallel_count = 2  # 2 parallel, rest sequential
    else:
        parallel_count = 3  # 3 parallel streams for many skills
    
    # Distribute skills across parallel streams (round-robin)
    streams = [[] for _ in range(parallel_count)]
    for i, skill in enumerate(ranked_skills):
        streams[i % parallel_count].append(skill)
    
    # Calculate timing for each skill
    result = []
    skill_index = 0
    
    for stream_idx, stream in enumerate(streams):
        # Days per stream = total days / number of streams
        stream_days = max(1, days_available // parallel_count)
        
        for skill_idx, skill in enumerate(stream):
            # Within a stream, distribute time proportionally to complexity
            estimated_hours = skill['complexity'] * 10  # rough estimate: complexity * 10 hours
            estimated_days = max(2, estimated_hours // 4)  # Assuming 4 hours/day learning
            
            result.append({
                'skill': skill['skill'],
                'weight': skill['weight'],
                'complexity': skill['complexity'],
                'parallel_stream': stream_idx + 1,
                'stream_position': skill_idx + 1,
                'total_stream_days': stream_days,
                'estimated_days': min(estimated_days, stream_days),
                'order': skill_index
            })
            skill_index += 1
    
    return result


def generate_skill_roadmap(skill, days_available, parallel_info=None):
    """
    Generate detailed learning roadmap for a single skill.
    Returns subtopics with estimated duration and resources.
    """
    try:
        subtopics = generate_subtopics(skill)
    except Exception as e:
        print(f"⚠️ AI generation failed for {skill}, using fallback: {e}")
        subtopics = [
            f"{skill} Fundamentals & Basics",
            f"{skill} Core Concepts & Architecture",
            f"{skill} Practical Implementation",
            f"{skill} Advanced Patterns & Optimization",
            f"{skill} Real-world Projects"
        ]
    
    # Distribute days among subtopics
    estimated_days = parallel_info.get('estimated_days', days_available // 5) if parallel_info else days_available // 5
    days_per_subtopic = max(1, estimated_days // len(subtopics))
    
    roadmap = {
        "skill": skill,
        "estimated_days": estimated_days,
        "parallel_stream": parallel_info.get('parallel_stream', 1) if parallel_info else 1,
        "complexity": parallel_info.get('complexity', 3) if parallel_info else 3,
        "subtopics": []
    }
    
    for i, topic in enumerate(subtopics):
        subtopic = {
            "title": topic,
            "estimated_days": days_per_subtopic,
            "week": (i // 2) + 1,  # Group into weeks (2 subtopics per week typically)
            "resources": {
                "youtube": [
                    f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}+{topic.replace(' ', '+')}+tutorial"
                ],
                "docs": [
                    f"https://www.google.com/search?q={skill.replace(' ', '+')}+{topic.replace(' ', '+')}+documentation"
                ],
                "github": [
                    f"https://github.com/search?q={skill.replace(' ', '+')}+{topic.replace(' ', '+')}+project"
                ],
                "practice": [
                    f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}+{topic.replace(' ', '+')}+practice"
                ]
            },
            "practice_projects": [
                f"Build a mini-project demonstrating {topic}",
                f"Solve 5-10 practice problems on {topic}",
                f"Create a portfolio piece showcasing {topic}"
            ],
            "milestones": [
                f"Understand core concepts of {topic}",
                f"Complete practice exercises",
                f"Build project using {topic}"
            ]
        }
        roadmap["subtopics"].append(subtopic)
    
    return roadmap


def build_personalized_job_roadmap(resume_skills, jd_skills, jd_skill_weights=None, deadline_str=None, days_fallback=30):
    """
    Master function: Build comprehensive personalized job roadmap.
    
    Args:
        resume_skills: List of skills student has
        jd_skills: List of skills required by job
        jd_skill_weights: Dict of skill -> importance weight from JD parsing
        deadline_str: ISO date string or days remaining until deadline
        days_fallback: Default days if deadline can't be parsed
    
    Returns:
        Comprehensive roadmap with all details, timing, and resources
    """
    # Calculate available time
    days_available = calculate_days_until_deadline(deadline_str) if deadline_str else days_fallback
    
    # Identify matched and missing skills
    resume_set = set(s.lower() for s in resume_skills)
    jd_set = set(s.lower() for s in jd_skills)
    
    matched = list(resume_set.intersection(jd_set))
    missing = [skill for skill in jd_skills if skill.lower() not in resume_set]
    
    # Rank missing skills by importance
    ranked_missing = rank_skills_by_importance(matched, missing, jd_skill_weights)
    
    # Distribute skills intelligently across available time
    skill_distribution = distribute_skills_by_time(ranked_missing, days_available)
    
    # Generate detailed roadmap for each missing skill
    skill_roadmaps = []
    for skill_info in skill_distribution:
        skill_roadmap = generate_skill_roadmap(
            skill_info['skill'],
            skill_info['estimated_days'],
            skill_info
        )
        skill_roadmaps.append(skill_roadmap)
    
    # Build comprehensive response
    response = {
        "status": "success",
        "analysis": {
            "resume_skills_count": len(resume_skills),
            "jd_skills_count": len(jd_skills),
            "matched_skills": matched,
            "matched_count": len(matched),
            "missing_skills": missing,
            "missing_count": len(missing),
            "match_percentage": round((len(matched) / len(jd_skills) * 100), 2) if jd_skills else 0,
            "days_available": days_available
        },
        "timeline": {
            "start_date": datetime.now().isoformat(),
            "target_completion": (datetime.now() + timedelta(days=days_available)).isoformat(),
            "total_days": days_available,
            "learning_hours_per_day": 4,  # Recommended
            "total_learning_hours": sum(s['estimated_days'] * 4 for s in skill_roadmaps)
        },
        "learning_strategy": {
            "approach": f"Parallel learning with {len(set(s['parallel_stream'] for s in skill_roadmaps))} focus streams",
            "parallel_streams": len(set(s['parallel_stream'] for s in skill_roadmaps)),
            "sequential_order": False,
            "rationale": "Learn high-priority skills in parallel to maximize prep time while maintaining focus"
        },
        "skill_roadmaps": skill_roadmaps,
        "weekly_schedule_template": generate_weekly_template(skill_roadmaps, days_available),
        "success_metrics": {
            "minimum_competency": "Basic understanding + 1 small project per skill",
            "target_competency": "Intermediate + portfolio-ready project per skill",
            "success_criteria": [
                "Complete 80% of subtopics for all skills",
                "Build 1 project per skill demonstrating competency",
                "Pass mock interviews covering missing skills",
                "Achieve 70%+ match with job requirements"
            ]
        }
    }
    
    return response


def generate_weekly_template(skill_roadmaps, total_days):
    """
    Generate a weekly learning schedule template.
    """
    weeks = max(1, total_days // 7)
    days_per_week = total_days / weeks if weeks > 0 else 7
    
    template = {
        "weeks": weeks,
        "days_per_week": round(days_per_week, 1),
        "sample_week_structure": {
            "monday": "Learn theory for Stream 1 skill",
            "tuesday": "Practice exercises for Stream 1 skill",
            "wednesday": "Learn theory for Stream 2 skill",
            "thursday": "Practice exercises for Stream 2 skill",
            "friday": "Build mini-project for any skill",
            "saturday": "Review + mock interview prep",
            "sunday": "Rest or catch up on pending topics"
        },
        "daily_routine": {
            "morning_2hours": "Theory & concepts learning",
            "afternoon_1.5hours": "Practice exercises & coding",
            "evening_0.5hours": "Documentation review & planning",
            "notes": "Adjust timing based on personal preferences"
        }
    }
    
    return template

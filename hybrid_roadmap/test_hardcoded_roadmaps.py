"""
Test utility to verify hardcoded roadmaps are working correctly
"""

from modules.roadmap.hardcoded_roadmaps import (
    get_hardcoded_roadmap,
    is_skill_hardcoded,
    HARDCODED_ROADMAPS
)
import json

def test_hardcoded_roadmaps():
    """Test all hardcoded roadmaps"""
    
    print("=" * 80)
    print("HARDCODED ROADMAPS TEST SUITE")
    print("=" * 80)
    
    # Test available skills
    print("\n✅ Available Hardcoded Skills:")
    for skill in HARDCODED_ROADMAPS.keys():
        print(f"   - {skill.upper()}")
    
    # Test each skill
    for skill in ["python", "javascript", "css", "aws", "azure"]:
        print(f"\n{'=' * 80}")
        print(f"Testing: {skill.upper()}")
        print("=" * 80)
        
        # Check if skill is hardcoded
        is_hardcoded = is_skill_hardcoded(skill)
        print(f"✅ Is Hardcoded: {is_hardcoded}")
        
        if is_hardcoded:
            roadmap = get_hardcoded_roadmap(skill)
            
            print(f"📚 Skill: {roadmap.get('skill', 'N/A')}")
            print(f"📖 Description: {roadmap.get('description', 'N/A')}")
            print(f"⏱️  Total Days: {roadmap.get('totalDays', 'N/A')}")
            print(f"🎯 Difficulty: {roadmap.get('difficulty', 'N/A')}")
            
            # Show phases
            phases = roadmap.get('phases', [])
            print(f"\n📋 Phases ({len(phases)}):")
            for phase in phases:
                print(f"   {phase.get('name')}")
                print(f"   Duration: {phase.get('duration')}")
                topics = phase.get('topics', [])
                print(f"   Topics: {len(topics)}")
                for topic in topics[:2]:  # Show first 2 topics
                    print(f"      - {topic.get('title')}")
                    resources = topic.get('resources', [])
                    if resources:
                        print(f"        Resources: {len(resources)}")
                        for res in resources[:1]:  # Show first resource
                            print(f"          📎 {res.get('title', 'Resource')}: {res.get('url', 'N/A')[:50]}...")
            
            # Show projects
            projects = roadmap.get('projects', [])
            print(f"\n🚀 Projects ({len(projects)}):")
            for project in projects[:2]:  # Show first 2 projects
                print(f"   - {project.get('name')}")
                print(f"     {project.get('description')}")

def test_skill_matching():
    """Test skill name matching"""
    print(f"\n{'=' * 80}")
    print("SKILL MATCHING TEST")
    print("=" * 80)
    
    test_skills = ["Python", "JAVASCRIPT", "CSS", "AWS", "azure", "java", "unknown"]
    
    for skill in test_skills:
        is_found = is_skill_hardcoded(skill)
        status = "✅" if is_found else "❌"
        print(f"{status} {skill:15} -> {is_found}")

def export_roadmap_summary():
    """Export summary of all roadmaps"""
    print(f"\n{'=' * 80}")
    print("ROADMAP SUMMARY")
    print("=" * 80)
    
    summary = {}
    for skill, roadmap in HARDCODED_ROADMAPS.items():
        summary[skill] = {
            "description": roadmap.get("description"),
            "totalDays": roadmap.get("totalDays"),
            "phases": len(roadmap.get("phases", [])),
            "projects": len(roadmap.get("projects", [])),
            "totalResources": sum(
                len(topic.get("resources", [])) 
                for phase in roadmap.get("phases", [])
                for topic in phase.get("topics", [])
            )
        }
    
    print(json.dumps(summary, indent=2))
    return summary

if __name__ == "__main__":
    test_hardcoded_roadmaps()
    test_skill_matching()
    export_roadmap_summary()
    print("\n✅ All tests completed!")

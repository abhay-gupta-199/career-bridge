import os
import re
import json

try:
    from google import genai
    from google.genai import errors
    # configure with API key if provided
    API_KEY = os.environ.get("GEMINI_API_KEY")
    if API_KEY:
        client = genai.Client(api_key=API_KEY)
    else:
        client = None
    GEMINI_AVAILABLE = True
except Exception:
    client = None
    errors = None
    GEMINI_AVAILABLE = False


def clean_json(text: str):
    match = re.search(r"\{[\s\S]*\}|\[[\s\S]*\]", text, re.DOTALL)
    return match.group(0) if match else text


def generate_subtopics(skill: str):
    """
    Use Google Gemini to generate 5-8 subtopics for a skill.
    """
    if not GEMINI_AVAILABLE or not client:
        raise RuntimeError("Gemini client not available")

    prompt = (
        f"Generate a list of 5 to 8 MOST IMPORTANT subtopics required to master '{skill}'."
        " Return ONLY a valid JSON ARRAY of strings, nothing else."
        " Example: [\"Introduction\", \"Basics\", \"Advanced Concepts\"]"
    )

    try:
        model_name = os.environ.get('GEMINI_MODEL', 'gemini-2.0-flash')
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        text = response.text

        cleaned = clean_json(text)
        try:
            return json.loads(cleaned)
        except Exception:
            lines = [l.strip('-• \n\r ') for l in cleaned.splitlines() if l.strip()]
            return lines[:8]
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            print(f"⚠️  Gemini API quota exceeded. Please enable billing.")
            raise RuntimeError(f"Gemini quota exceeded: {error_msg[:100]}")
        else:
            raise RuntimeError(f"Gemini generation failed: {error_msg[:100]}")


def generate_detailed_roadmap(skill: str, days_available: int):
    """
    Generate a detailed learning roadmap with topics, subtopics, time periods, and documentation links.
    Returns structured roadmap with comprehensive learning path.
    """
    if not GEMINI_AVAILABLE or not client:
        raise RuntimeError("Gemini client not available")

    days_per_topic = max(1, days_available // 4)  # Divide available time among main topics
    
    prompt = f"""Generate a detailed learning roadmap for mastering '{skill}' in {days_available} days.

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{{
  "skill": "{skill}",
  "totalDays": {days_available},
  "overview": "Brief overview of the skill and its importance",
  "topics": [
    {{
      "title": "Topic name",
      "description": "What this topic covers",
      "daysToComplete": {days_per_topic},
      "difficulty": "Beginner|Intermediate|Advanced",
      "subtopics": [
        {{
          "name": "Subtopic name",
          "description": "What you'll learn",
          "timeInHours": 5,
          "keyPoints": ["point1", "point2", "point3"],
          "practiceExercises": ["exercise1", "exercise2"]
        }}
      ],
      "resources": [
        {{
          "type": "documentation|tutorial|course|video",
          "title": "Resource title",
          "url": "Specific documentation or tutorial URL",
          "difficulty": "Beginner|Intermediate|Advanced"
        }}
      ],
      "project": {{
        "title": "Hands-on project name",
        "description": "What you'll build",
        "estimatedHours": 8
      }}
    }}
  ],
  "weeklySchedule": [
    {{
      "week": 1,
      "focus": "Main focus areas",
      "dailyCommitment": "X hours per day",
      "goals": ["goal1", "goal2"]
    }}
  ],
  "assessmentMilestones": [
    {{
      "milestone": "After topic completion",
      "assessment": "How to verify learning",
      "targetDate": "Day X"
    }}
  ],
  "commonPitfalls": ["pitfall1", "pitfall2"],
  "tips": ["tip1", "tip2", "tip3"]
}}"""

    try:
        model_name = os.environ.get('GEMINI_MODEL', 'gemini-2.0-flash')
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        text = response.text

        cleaned = clean_json(text)
        try:
            roadmap = json.loads(cleaned)
            return roadmap
        except Exception as e:
            print(f"⚠️  Failed to parse Gemini response: {e}")
            raise RuntimeError(f"Invalid JSON from Gemini: {str(e)[:100]}")
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            print(f"⚠️  Gemini API quota exceeded.")
            raise RuntimeError(f"Gemini quota exceeded")
        else:
            raise RuntimeError(f"Gemini generation failed: {error_msg[:100]}")




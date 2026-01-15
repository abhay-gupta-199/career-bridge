import os
from .gemini_agent import generate_subtopics as gemini_generate, GEMINI_AVAILABLE


def generate_subtopics(skill: str):
    """
    Generate 5–8 proper subtopics for the skill.
    Uses only Gemini for intelligent subtopic generation.
    """
    if not GEMINI_AVAILABLE:
        raise RuntimeError("Gemini API is not available. Please configure GEMINI_API_KEY.")
    
    try:
        return gemini_generate(skill)
    except Exception as e:
        print(f'⚠️  Gemini generation failed: {e}')
        # No fallback - user must enable Gemini
        raise RuntimeError(f"Failed to generate subtopics: {str(e)}")







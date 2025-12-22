import re
import json
import os

# Prefer Gemini if configured
try:
    from .gemini_agent import generate_subtopics as gemini_generate, GEMINI_AVAILABLE
except Exception:
    gemini_generate = None
    GEMINI_AVAILABLE = False

try:
    from langchain_ollama import OllamaLLM
    from langchain_core.prompts import ChatPromptTemplate
    LLM_AVAILABLE = True
except Exception:
    LLM_AVAILABLE = False


def clean_json(text: str):
    match = re.search(r"\[.*\]", text, re.DOTALL)
    return match.group(0) if match else text


def generate_subtopics(skill: str):
    """
    Generate 5–8 proper subtopics for the skill.
    Uses Gemini if GEMINI_API_KEY present and gemini_agent available, else falls back to Ollama LLM, then to simple heuristics.
    """
    # If environment requests Gemini, prefer it
    use_gemini = os.environ.get('USE_GEMINI') == '1' or os.environ.get('GEMINI_API_KEY')
    if use_gemini and GEMINI_AVAILABLE and gemini_generate:
        try:
            return gemini_generate(skill)
        except Exception as e:
            # fallback to local LLM if Gemini fails
            print('Gemini generation failed, falling back to Ollama:', e)

    if LLM_AVAILABLE:
        try:
            llm = OllamaLLM(
                model=os.environ.get('OLLAMA_MODEL', 'llama3.2:3b'),
                temperature=float(os.environ.get('OLLAMA_TEMP', 0.2)),
                num_ctx=int(os.environ.get('OLLAMA_CTX', 4096))
            )

            prompt = ChatPromptTemplate.from_template("""
Generate a list of 5 to 8 MOST IMPORTANT subtopics required to master "{skill}".
Return ONLY valid JSON ARRAY of strings.

Example:
["Introduction", "Basics", "Advanced Concepts"]
""")

            raw = llm.invoke(prompt.format(skill=skill))
            cleaned = clean_json(raw)
            try:
                return json.loads(cleaned)
            except Exception:
                pass
        except Exception as e:
            print('Ollama LLM call failed, falling back to heuristics:', e)

    # Heuristic fallback
    return [
        f"{skill} Basics",
        f"{skill} Fundamentals",
        f"{skill} Intermediate",
        f"{skill} Advanced"
    ]






import os
import re
import json

try:
    import google.generativeai as genai
    # configure with API key if provided
    API_KEY = os.environ.get("GEMINI_API_KEY")
    if API_KEY:
        try:
            genai.configure(api_key=API_KEY)
        except Exception:
            # some client versions may use different configuration flows; ignore
            pass
    GEMINI_AVAILABLE = True
except Exception:
    genai = None
    GEMINI_AVAILABLE = False


def clean_json(text: str):
    match = re.search(r"\[.*\]", text, re.DOTALL)
    return match.group(0) if match else text


def generate_subtopics(skill: str):
    """
    Use Google Gemini (via google.generativeai) to generate 5-8 subtopics for a skill.
    Falls back to a simple list if Gemini isn't available or the call fails.
    """
    if not GEMINI_AVAILABLE:
        # signal caller that Gemini is not configured
        raise RuntimeError("Gemini client not available")

    prompt = (
        f"Generate a list of 5 to 8 MOST IMPORTANT subtopics required to master '{skill}'."
        " Return ONLY a valid JSON ARRAY of strings, nothing else."
        " Example: [\"Introduction\", \"Basics\", \"Advanced Concepts\"]"
    )

    try:
        model = os.environ.get('GEMINI_MODEL') or os.environ.get('GEMINI_MODEL_NAME') or 'gemini-pro'
        # Try to use the common client surface; different versions expose different helpers.
        if hasattr(genai, 'chat'):
            # modern google.generativeai
            resp = genai.chat.completions.create(model=model, messages=[{"role": "user", "content": prompt}])
            # Extract text from response in a safe manner
            text = ''
            try:
                text = resp.choices[0].message.content[0].text
            except Exception:
                try:
                    text = resp.choices[0].message
                except Exception:
                    text = str(resp)
        else:
            # fallback to generate (older client names)
            resp = genai.generate(model=model, prompt=prompt)
            text = getattr(resp, 'text', str(resp))

        cleaned = clean_json(text)
        try:
            return json.loads(cleaned)
        except Exception:
            # last-resort: split lines into list
            lines = [l.strip('-• \n\r ') for l in cleaned.splitlines() if l.strip()]
            return lines[:8]
    except Exception as e:
        # bubble up so callers can fallback
        raise RuntimeError(f"Gemini generation failed: {e}")

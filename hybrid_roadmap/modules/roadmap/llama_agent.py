from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import json
import re

llm = OllamaLLM(
    model="llama3.2:3b",
    temperature=0.2,
    num_ctx=4096
)

def clean_json(text: str):
    match = re.search(r"\[.*\]", text, re.DOTALL)
    return match.group(0) if match else text


def generate_subtopics(skill: str):
    """
    Generate 5–8 proper subtopics for the skill.
    """
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
    except:
        return [
            f"{skill} Basics",
            f"{skill} Fundamentals",
            f"{skill} Advanced Concepts"
        ]






# from langchain_community.llms import Ollama
# from langchain_core.prompts import PromptTemplate
# from langchain_core.chains import LLMChain


# def get_llm():
#     return Ollama(model="llama3")

# def generate_roadmap_with_ai(skill: str) -> str:
#     llm = get_llm()
#     prompt = PromptTemplate(
#         input_variables=["skill"],
#         template=(
#             "You are a senior mentor. Create a 3-phase learning roadmap for {skill}. "
#             "Each phase must include: title, 3-5 subtopics, duration_weeks, and one mini-project. "
#             "Return strict JSON with key 'phases': [{{title, topics, duration_weeks, project}}]."
#         )
#     )
#     chain = LLMChain(prompt=prompt, llm=llm)
#     return chain.run(skill)


# from langchain_community.llms import Ollama
# from langchain.prompts import PromptTemplate
# from langchain.chains import LLMChain


# def get_llm():
#     """Initialize local LLaMA model via Ollama"""
#     return Ollama(model="llama3")


# def generate_roadmap_with_ai(skill: str) -> str:
#     """
#     Generate a structured 3-phase learning roadmap for a given skill using LLaMA.
#     Output is strict JSON for frontend usage.
#     """
#     llm = get_llm()
#     prompt = PromptTemplate(
#         input_variables=["skill"],
#         template=(
#             "You are a senior technical mentor. Create a detailed 3-phase learning roadmap for mastering {skill}. "
#             "Each phase must include: title, 3-5 subtopics, duration_weeks, and one mini-project. "
#             "Respond strictly in valid JSON with the following format:\n"
#             "{{ 'phases': [ {{'title': '...', 'topics': [...], 'duration_weeks': X, 'project': '...'}}, ... ] }}"
#         )
#     )

#     chain = LLMChain(prompt=prompt, llm=llm)
#     response = chain.run(skill)

#     # Optional: try to clean and load JSON if model adds extra text
#     try:
#         import json
#         response_json = json.loads(response)
#         return json.dumps(response_json, indent=2)
#     except Exception:
#         return response  # fallback (raw text)



from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import json


def get_llm():
    """Initialize local LLaMA model via Ollama"""
    return OllamaLLM(model="llama3")


def generate_roadmap_with_ai(skill: str) -> str:
    """
    Generate a structured 3-phase learning roadmap for a given skill using LLaMA.
    Output is strict JSON for frontend usage.
    """
    llm = get_llm()

    # 🧩 Updated ChatPromptTemplate (new syntax)
    prompt = ChatPromptTemplate.from_template(
        "You are a senior technical mentor. Create a detailed 3-phase learning roadmap for mastering {skill}. "
        "Each phase must include: title, 3-5 subtopics, duration_weeks, and one mini-project. "
        "Respond strictly in valid JSON with the following format:\n"
        "{{ 'phases': [ {{'title': '...', 'topics': [...], 'duration_weeks': X, 'project': '...'}}, ... ] }}"
    )

    # ⚡ New chaining style — no LLMChain
    chain = prompt | llm

    # 🧠 Invoke model
    response = chain.invoke({"skill": skill})

    # ✅ Clean JSON if model adds extra tokens
    try:
        response_json = json.loads(response)
        return json.dumps(response_json, indent=2)
    except Exception:
        return str(response)  # fallback: return raw text


# 🧪 Test
if __name__ == "__main__":
    print(generate_roadmap_with_ai("Machine Learning"))


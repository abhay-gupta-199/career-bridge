import PyPDF2
from docx import Document
import pandas as pd
from modules.parsing.skill_extractor import extract_skills

def _extract_text_from_docx(path: str) -> str:
    doc = Document(path)
    return " ".join(p.text for p in doc.paragraphs)

def _extract_text_from_pdf(path: str) -> str:
    text = ""
    with open(path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text

def parse_resume(file_path: str, skills_csv_path: str) -> list[str]:
    df = pd.read_csv(skills_csv_path)
    all_skills = df["skill"].dropna().tolist()
    if file_path.lower().endswith(".pdf"):
        text = _extract_text_from_pdf(file_path)
    elif file_path.lower().endswith(".docx"):
        text = _extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported resume format. Use .pdf or .docx")
    return extract_skills(text, all_skills)

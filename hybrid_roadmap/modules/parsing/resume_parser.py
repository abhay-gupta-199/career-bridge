import csv
import PyPDF2
from docx import Document
from modules.parsing.skill_extractor import extract_skills

def _load_skills(skills_csv_path: str) -> list[str]:
    skills = []
    with open(skills_csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        next(reader, None)
        for row in reader:
            if not row or not row[0].strip():
                continue
            skills.append(row[0].strip())
    return skills

def _extract_text_from_docx(path: str) -> str:
    doc = Document(path)
    return ' '.join(p.text for p in doc.paragraphs)

def _extract_text_from_pdf(path: str) -> str:
    text = ''
    with open(path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ''
    return text

def parse_resume(file_path: str, skills_csv_path: str) -> list[str]:
    """
    Parses a resume and extracts only valid skills found in the skills CSV taxonomy.
    This prevents junk data, random noun phrases, and non-skills from polluting the system.
    """
    all_skills = _load_skills(skills_csv_path)
    
    if file_path.lower().endswith('.pdf'):
        text = _extract_text_from_pdf(file_path)
    elif file_path.lower().endswith('.docx'):
        text = _extract_text_from_docx(file_path)
    else:
        raise ValueError('Unsupported resume format. Use .pdf or .docx')
        
    # Strictly extract only verified skills from our taxonomy list
    skills = extract_skills(text, all_skills)
    
    return skills

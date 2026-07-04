from modules.parsing.resume_parser import parse_resume
skills = parse_resume("Bhoomika_agrawal.resume.pdf", "data/skills.csv")
print("Total skills extracted:", len(skills))
print("Skills list:", skills)

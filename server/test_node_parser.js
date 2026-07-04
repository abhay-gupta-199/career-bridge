const fs = require('fs');
const pdfParse = require('pdf-parse');
const { extractResumeSkills } = require('./utils/skillExtractor');

async function run() {
    const dataBuffer = fs.readFileSync('../hybrid_roadmap/Bhoomika_agrawal.resume.pdf');
    const data = await pdfParse(dataBuffer);
    const result = extractResumeSkills(data.text);
    console.log("Total skills extracted locally:", result.extractedSkills.length);
    console.log("Skills list:", result.extractedSkills);
}
run();

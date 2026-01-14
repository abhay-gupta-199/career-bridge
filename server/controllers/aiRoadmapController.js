const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateRoadmap = async (req, res) => {
    try {
        const { role, skills, availability, duration } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'Gemini API key is not configured' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      Create a detailed learning roadmap for a student aspiring to be a "${role}".
      Current Skills: ${skills || 'None'}.
      Availability: ${availability} hours per week.
      Target Duration: ${duration} months.

      Please provide the roadmap in the following strict JSON format:
      {
        "title": "Roadmap Title",
        "description": "Brief overview",
        "phases": [
          {
            "name": "Phase Name (e.g., Month 1 or Foundation)",
            "duration": "Duration description",
            "topics": [
              {
                "topic": "Topic Name",
                "description": "What to learn",
                "resources": ["Link or resource name"]
              }
            ]
          }
        ]
      }
      
      Ensure the response is ONLY valid JSON, no markdown formatting or extra text.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const roadmapData = JSON.parse(cleanedText);

        res.json({ success: true, roadmap: roadmapData });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'Failed to generate roadmap', error: error.message });
    }
};

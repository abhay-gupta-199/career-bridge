// personalizedRoadmap.js
require('dotenv').config();
const axios = require('axios');

// Using gemini-1.5-flash as it is the current standard stable flash model
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Helper to calculate days until deadline
function calculateDaysUntilDeadline(deadlineStr) {
    try {
        if (!deadlineStr) return 30; // Default
        if (typeof deadlineStr === 'number') return deadlineStr;

        const deadline = new Date(deadlineStr);
        const now = new Date();
        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays);
    } catch (e) {
        console.warn('Could not parse deadline, using default 30 days:', e);
        return 30;
    }
}

// Rank skills by importance
function rankSkillsByImportance(matchedSkills, missingSkills, jdSkillWeights = {}) {
    return missingSkills.map(skill => {
        let weight = jdSkillWeights[skill] || jdSkillWeights[skill.toLowerCase()] || 0;

        if (weight === 0) {
            const lower = skill.toLowerCase();
            if (['python', 'java', 'javascript', 'sql', 'react', 'node', 'express'].some(k => lower.includes(k))) weight = 3;
            else if (['aws', 'docker', 'kubernetes', 'git', 'linux'].some(k => lower.includes(k))) weight = 2;
            else weight = 1;
        }

        return {
            skill,
            weight,
            complexity: estimateComplexity(skill)
        };
    }).sort((a, b) => (b.weight - a.weight) || (b.complexity - a.complexity));
}

// Estimate complexity (simple heuristic)
function estimateComplexity(skill) {
    const lower = skill.toLowerCase();
    if (['machine learning', 'system design', 'kubernetes'].some(k => lower.includes(k))) return 5;
    if (['aws', 'microservices', 'docker'].some(k => lower.includes(k))) return 4;
    if (['react', 'node', 'sql', 'python', 'java'].some(k => lower.includes(k))) return 3;
    if (['html', 'css', 'git'].some(k => lower.includes(k))) return 2;
    return 3;
}

// Distribute skills logic
function distributeSkillsByTime(rankedSkills, daysAvailable) {
    if (!rankedSkills.length) return [];

    const numSkills = rankedSkills.length;
    let parallelCount = 1;
    if (numSkills === 2) parallelCount = 2;
    else if (numSkills <= 4) parallelCount = 2;
    else if (numSkills >= 5) parallelCount = 3;

    const result = [];
    const streams = Array.from({ length: parallelCount }, () => []);

    rankedSkills.forEach((item, i) => {
        streams[i % parallelCount].push(item);
    });

    streams.forEach((stream, streamIdx) => {
        const streamDays = Math.max(1, Math.floor(daysAvailable / parallelCount));
        stream.forEach((item, idx) => {
            const estimatedHours = item.complexity * 10;
            const estimatedDays = Math.ceil(estimatedHours / 4); // 4 hours/day

            result.push({
                ...item,
                parallel_stream: streamIdx + 1,
                total_stream_days: streamDays,
                estimated_days: Math.min(estimatedDays, streamDays)
            });
        });
    });

    return result;
}

// Generate subtopics using Gemini
async function generateSubtopicsWithGemini(skill) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('CRITICAL: GEMINI_API_KEY is missing from process.env');
        throw new Error('GEMINI_API_KEY not set');
    }

    const prompt = `Generate a structured learning path for the skill "${skill}".
  Return a JSON object with this EXACT structure:
  {
    "subtopics": [
      {
        "title": "Subtopic Title",
        "project": "Mini project idea description",
        "youtube_search_query": "Search query for tutorials"
      }
    ],
    "final_projects": {
      "suggested": ["Project Idea 1", "Project Idea 2"],
      "github_search_queries": ["repo query 1", "repo query 2"]
    }
  }
  Generate 4-6 subtopics.`;

    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
        );

        const text = response.data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(jsonStr);
    } catch (e) {
        if (e.response) {
            console.error(`Gemini generation failed for ${skill}: Status ${e.response.status}`, JSON.stringify(e.response.data));
        } else {
            console.error(`Gemini generation failed for ${skill}:`, e.message);
        }
        // Fallback
        return {
            subtopics: [
                { title: `${skill} Fundamentals`, project: `Basic ${skill} app`, youtube_search_query: `${skill} tutorial` },
                { title: `${skill} Advanced Concepts`, project: `Advanced ${skill} system`, youtube_search_query: `${skill} advanced tutorial` }
            ],
            final_projects: {
                suggested: [`Complete ${skill} Application`],
                github_search_queries: [`${skill} project`]
            }
        };
    }
}

// Main function to build roadmap
async function buildPersonalizedJobRoadmap({ resumeSkills, jdSkills, jdSkillWeights, deadline, daysFallback }) {
    const daysAvailable = calculateDaysUntilDeadline(deadline) || daysFallback;

    const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
    const missing = jdSkills.filter(s => !resumeSet.has(s.toLowerCase()));
    const matched = jdSkills.filter(s => resumeSet.has(s.toLowerCase()));

    const rankedMissing = rankSkillsByImportance(matched, missing, jdSkillWeights);
    const distribution = distributeSkillsByTime(rankedMissing, daysAvailable);

    // Create roadmap object compatible with RoadmapViewer
    const roadmap = {};

    // Generate content for each skill in parallel
    await Promise.all(distribution.map(async (item) => {
        const content = await generateSubtopicsWithGemini(item.skill);

        // Transform to frontend format
        roadmap[item.skill] = {
            main_course: item.skill,
            duration_weeks: Math.ceil(item.estimated_days / 7),
            subtopics: content.subtopics.map(sub => ({
                title: sub.title,
                project: sub.project,
                youtube_links: [
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(sub.youtube_search_query || sub.title + ' tutorial')}`
                ]
            })),
            final_projects: {
                suggested: content.final_projects?.suggested || [],
                github_references: (content.final_projects?.github_search_queries || []).map(q =>
                    `https://github.com/search?q=${encodeURIComponent(q)}`
                )
            }
        };
    }));

    if (Object.keys(roadmap).length === 0 && matched.length > 0) {
        // If no missing skills, maybe generate for advanced topics of matched skills?
        // For now, just return empty or success message?
        // The frontend expects keys.
    }

    return {
        status: 'success',
        roadmap
    };
}

module.exports = {
    buildPersonalizedJobRoadmap
};

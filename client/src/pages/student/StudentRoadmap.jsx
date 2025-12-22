import React, { useState } from "react";
import { fetchRoadmap } from "../../api/roadmapApi";
import RoadmapViewer from "../../components/RoadmapViewer";

const StudentRoadmap = () => {
  const [skills, setSkills] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("api"); // api | local

  const handleGenerate = async () => {
    if (!skills.trim()) return alert("Enter at least one skill!");

    setLoading(true);
    try {
      const skillList = skills.split(",").map(s => s.trim());
      if (source === "api") {
        const data = await fetchRoadmap(skillList);
        setRoadmap(data.roadmap);
      } else {
        const local = generateLocalRoadmap(skillList);
        setRoadmap(local);
      }
    } catch (err) {
      // fallback to local hard-coded roadmap
      console.warn("Roadmap API failed, using local fallback:", err);
      const skillList = skills.split(",").map(s => s.trim());
      const local = generateLocalRoadmap(skillList);
      setRoadmap(local);
    }
    setLoading(false);
  };

  const generateLocalRoadmap = (skillList) => {
    // Basic hard-coded templates for a few common skills
    const templates = {
      Python: {
        main_course: "Python for Developers",
        duration_weeks: 6,
        subtopics: [
          {
            title: "Core Python & Data Structures",
            project: "Build a CLI todo app",
            youtube_links: ["https://youtu.be/rfscVS0vtbw"]
          },
          {
            title: "Web with Flask/Django",
            project: "Simple blog app",
            youtube_links: ["https://youtu.be/Z1RJmh_OqeA"]
          },
          {
            title: "Data Manipulation & APIs",
            project: "Data ETL script",
            youtube_links: ["https://youtu.be/GPVsHOlRBBI"]
          }
        ],
        final_projects: {
          suggested: ["Personal portfolio API", "Data analysis mini-project"],
          github_references: ["https://github.com/tiangolo/fastapi"]
        }
      },
      SQL: {
        main_course: "SQL & Databases",
        duration_weeks: 4,
        subtopics: [
          { title: "Basics & Joins", project: "Design a small schema", youtube_links: ["https://youtu.be/7S_tz1z_5bA"] },
          { title: "Indexes & Performance", project: "Optimize queries", youtube_links: ["https://youtu.be/5hzZtqCNQKk"] }
        ],
        final_projects: { suggested: ["Analytics dashboard"], github_references: [] }
      },
      React: {
        main_course: "React Fundamentals",
        duration_weeks: 6,
        subtopics: [
          { title: "Components & Props", project: "Todo app", youtube_links: ["https://youtu.be/Ke90Tje7VS0"] },
          { title: "State & Hooks", project: "Notes app", youtube_links: ["https://youtu.be/dpw9EHDh2bM"] }
        ],
        final_projects: { suggested: ["Full-stack MERN app"], github_references: ["https://github.com/facebook/react"] }
      }
    }

    const roadmap = {}
    skillList.forEach(raw => {
      const key = raw.charAt(0).toUpperCase() + raw.slice(1)
      roadmap[key] = templates[key] || {
        main_course: `${key} Fundamentals`,
        duration_weeks: 4,
        subtopics: [
          { title: "Basics", project: "Practice exercises", youtube_links: [] }
        ],
        final_projects: { suggested: ["Capstone mini-project"], github_references: [] }
      }
    })
    return roadmap
  }

  const RecommendationPanel = ({ roadmap }) => {
    if (!roadmap) return null
    // simple aggregated recommendations
    const courses = [];
    const roles = new Set();
    Object.keys(roadmap).forEach(skill => {
      courses.push(`${roadmap[skill].main_course} (${roadmap[skill].duration_weeks}w)`)
      if (["Python", "SQL"].includes(skill)) roles.add("Data Engineer / Analyst")
      if (["React"].includes(skill)) roles.add("Frontend Developer")
    })

    return (
      <div className="bg-white p-6 rounded shadow mt-6">
        <h3 className="text-xl font-bold mb-2">Recommendations</h3>
        <p className="mb-2">Suggested learning sequence:</p>
        <ul className="list-disc ml-6 mb-3">
          {courses.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
        <p className="mb-2">Target roles:</p>
        <ul className="list-disc ml-6">
          {[...roles].map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </div>
    )
  }

  return (
    <div className="p-8">
      
      <h1 className="text-3xl font-bold mb-4">My Learning Roadmap</h1>

      <div className="bg-white p-6 rounded shadow-md max-w-xl mb-8">
        <label className="font-semibold text-lg">Enter Skills:</label>
        <input
          type="text"
          placeholder="e.g. Python, SQL, Docker"
          className="border p-3 rounded w-full mt-2"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <div className="mt-3">
          <label className="text-sm font-medium mr-2">Source:</label>
          <select value={source} onChange={(e) => setSource(e.target.value)} className="border rounded p-2">
            <option value="api">AI API</option>
            <option value="local">Local Demo</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded"
        >
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>
      </div>

      {roadmap && <RoadmapViewer roadmap={roadmap} />}
      
    </div>
  );
};

export default StudentRoadmap;

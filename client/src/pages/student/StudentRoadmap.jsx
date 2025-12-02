import React, { useState } from "react";
import { fetchRoadmap } from "../../api/roadmapApi";
import RoadmapViewer from "../../components/RoadmapViewer";

const StudentRoadmap = () => {
  const [skills, setSkills] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!skills.trim()) return alert("Enter at least one skill!");

    setLoading(true);
    try {
      const skillList = skills.split(",").map(s => s.trim());
      const data = await fetchRoadmap(skillList);
      setRoadmap(data.roadmap);
    } catch (err) {
      alert("Failed to fetch roadmap");
    }
    setLoading(false);
  };

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

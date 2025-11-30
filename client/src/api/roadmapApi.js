

import RoadmapAPI from "./roadmapAxios";

export const fetchRoadmap = async (skills) => {
  try {
    const res = await RoadmapAPI.post("/generate-roadmap", { skills });
    return res.data;
  } catch (err) {
    console.error("Roadmap Fetch Error:", err);
    throw err;
  }
};




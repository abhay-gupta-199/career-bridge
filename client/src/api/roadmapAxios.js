import axios from "axios";

const RoadmapAPI = axios.create({
  baseURL: "http://127.0.0.1:5002/api",
});

export default RoadmapAPI;

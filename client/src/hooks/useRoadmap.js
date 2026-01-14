import { useState, useCallback } from 'react';
import {
  getJobsForRoadmaps,
  generateJobRoadmap,
  generateSkillsRoadmap,
  saveRoadmapProgress,
  getRoadmapProgress
} from '../api/roadmapApi';

export const useRoadmap = () => {
  const [jobs, setJobs] = useState([]);
  const [currentRoadmap, setCurrentRoadmap] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available jobs for roadmaps
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobsForRoadmaps();
      setJobs(data.recommendations || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate roadmap for specific job
  const generateJobRoadmapHandler = useCallback(async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateJobRoadmap(jobId);
      setCurrentRoadmap(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate roadmap for skills array
  const generateSkillsRoadmapHandler = useCallback(async (skills) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateSkillsRoadmap(skills);
      setCurrentRoadmap(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to generate skills roadmap');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save progress
  const updateProgress = useCallback(async (jobId, skillName, progressValue) => {
    try {
      await saveRoadmapProgress(jobId, skillName, progressValue);
      setProgress(prev => ({
        ...prev,
        [skillName]: progressValue
      }));
    } catch (err) {
      setError(err.message || 'Failed to save progress');
      console.error(err);
    }
  }, []);

  // Fetch user progress
  const fetchProgress = useCallback(async () => {
    try {
      const data = await getRoadmapProgress();
      setProgress(data || {});
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    }
  }, []);

  return {
    jobs,
    currentRoadmap,
    progress,
    loading,
    error,
    fetchJobs,
    generateJobRoadmapHandler,
    generateSkillsRoadmapHandler,
    updateProgress,
    fetchProgress,
    setCurrentRoadmap,
    setError
  };
};

export default useRoadmap;

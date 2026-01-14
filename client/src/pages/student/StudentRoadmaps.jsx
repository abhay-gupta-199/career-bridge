import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import RoadmapViewer from '../../components/RoadmapViewer';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  RefreshCw,
  Zap,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Loader,
  MapPin,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import GlassCard from '../../components/ui/GlassCard';
import GradientCard from '../../components/ui/GradientCard';
import AnimatedBadge from '../../components/ui/AnimatedBadge';
import { generateJobRoadmap, getJobsForRoadmaps } from '../../api/roadmapApi';

const StudentRoadmaps = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  const fetchRecommendedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobsForRoadmaps();
      const filteredJobs = (data.recommendations || []).filter(
        job => job.matchPercentage >= 50
      );
      setJobs(filteredJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job recommendations');
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmapForJob = async (jobId) => {
    setGeneratingRoadmap(true);
    setError(null);
    try {
      const roadmapData = await generateJobRoadmap(jobId);
      setRoadmap(roadmapData);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError('Failed to generate roadmap');
      setGeneratingRoadmap(false);
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    generateRoadmapForJob(job._id);
  };

  const handleBackFromRoadmap = () => {
    setSelectedJob(null);
    setRoadmap(null);
    setGeneratingRoadmap(false);
  };

  // Roadmap Detail View
  if (roadmap && selectedJob) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
              <div className="p-6 max-w-7xl mx-auto">
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={handleBackFromRoadmap}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back to Jobs
                </motion.button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="text-blue-600" size={32} />
                    {selectedJob.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <p className="text-gray-600 flex items-center gap-2">
                      <Briefcase size={16} /> {selectedJob.company}
                    </p>
                    {selectedJob.location && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin size={16} /> {selectedJob.location}
                      </p>
                    )}
                    <AnimatedBadge>
                      {selectedJob.matchPercentage || 0}% Match
                    </AnimatedBadge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-w-7xl mx-auto">
              {generatingRoadmap ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-96"
                >
                  <div className="text-center">
                    <Loader className="mx-auto mb-4 animate-spin text-blue-600" size={48} />
                    <p className="text-gray-600 text-lg font-medium">Generating AI-powered roadmap...</p>
                    <p className="text-gray-500 mt-2">This may take a moment as we craft your personalized learning path</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <RoadmapViewer roadmap={roadmap} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jobs List View
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                    <Zap className="text-yellow-500" size={36} />
                    Learning Roadmaps
                  </h1>
                  <p className="text-gray-600 mt-2">
                    AI-generated personalized learning paths based on your skill gaps
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchRecommendedJobs}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 transition-all shadow-lg"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </motion.button>
                <a
                  href="/student/custom-roadmap"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg ml-3"
                >
                  <MapPin size={20} />
                  Custom Roadmap
                </a>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GradientCard className="from-blue-500 to-blue-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Available Jobs</p>
                      <p className="text-white text-3xl font-bold mt-1">{jobs.length}</p>
                    </div>
                    <BookOpen className="text-blue-200" size={40} />
                  </div>
                </GradientCard>

                <GradientCard className="from-purple-500 to-purple-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">AI-Generated</p>
                      <p className="text-white text-3xl font-bold mt-1">100%</p>
                    </div>
                    <Sparkles className="text-purple-200" size={40} />
                  </div>
                </GradientCard>

                <GradientCard className="from-green-500 to-green-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Powered by</p>
                      <p className="text-white text-3xl font-bold mt-1">Gemini</p>
                    </div>
                    <TrendingUp className="text-green-200" size={40} />
                  </div>
                </GradientCard>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start gap-3"
              >
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonLoader key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <GlassCard className="p-12">
                  <Sparkles className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Available</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Add skills to your profile and view AI recommendations to generate personalized learning roadmaps
                  </p>
                  <a
                    href="/student/recommendations"
                    className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-lg"
                  >
                    View Recommendations
                  </a>
                </GlassCard>
              </motion.div>
            )}

            {/* Jobs Grid */}
            {!loading && jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => handleSelectJob(job)}
                    className="cursor-pointer"
                  >
                    <GlassCard className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <p className="text-sm opacity-90 flex items-center gap-2 mt-1">
                          <Briefcase size={14} /> {job.company}
                        </p>
                      </div>

                      {/* Body */}
                      <div className="p-6 space-y-4">
                        {/* Match Score */}
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <span className="text-gray-700 font-medium">Match Score</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {job.matchPercentage || 0}%
                          </span>
                        </div>

                        {/* Missing Skills */}
                        {job.missingSkills && job.missingSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Skills to Learn ({job.missingSkills.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.missingSkills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs rounded-full font-semibold border border-orange-200"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.missingSkills.length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-semibold border border-gray-200">
                                  +{job.missingSkills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Location & Type */}
                        <div className="space-y-2 pt-2 border-t border-gray-200">
                          {job.location && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <MapPin size={14} className="text-gray-500" />
                              {job.location}
                            </p>
                          )}
                          {job.jobType && (
                            <p className="text-sm text-gray-600">{job.jobType}</p>
                          )}
                        </div>

                        {/* CTA Button */}
                        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                          <Zap size={18} className="group-hover:animate-pulse" />
                          Generate Roadmap
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Info Section */}
            {!loading && jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
              >
                <GlassCard className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="text-yellow-500" size={24} />
                    How AI Roadmaps Work
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { num: '1', title: 'Skill Analysis', desc: 'AI analyzes your current skills' },
                      { num: '2', title: 'Gap Detection', desc: 'Identifies missing skills for the role' },
                      { num: '3', title: 'Path Generation', desc: 'Creates personalized learning path' },
                      { num: '4', title: 'Resources', desc: 'Curates best learning materials' }
                    ].map((step, idx) => (
                      <div key={idx} className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold mb-2">
                          {step.num}
                        </div>
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRoadmaps;

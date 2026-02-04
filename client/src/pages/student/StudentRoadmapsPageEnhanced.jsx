import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, AlertCircle, Zap, Briefcase, ChevronRight, Filter, X, BarChart3, Tag } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

/**
 * 🎓 Enhanced Student Roadmaps Page
 * Display jobs with percentage matching and skill analysis
 * Shows parsed resume skills and job requirements
 */

const StudentRoadmapsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State Management
  const [jobs, setJobs] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobMatches, setJobMatches] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewType, setViewType] = useState('cards'); // cards, list, detailed
  const [skillsModal, setSkillsModal] = useState(null);

  // Fetch student skills from resume
  useEffect(() => {
    const fetchStudentSkills = async () => {
      try {
        const response = await API.get('/api/student/profile');
        if (response.data.data.skills) {
          setStudentSkills(response.data.data.skills);
        }
      } catch (err) {
        console.error('Error fetching student skills:', err);
      }
    };

    fetchStudentSkills();
  }, []);

  // Fetch jobs with skill parsing
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await API.get('/api/student/jobs');
        const fetchedJobs = response.data.data || [];

        // Parse skills for jobs that don't have parsed skills
        const processedJobs = await Promise.all(
          fetchedJobs.map(async (job) => {
            if (!job.parsedSkills || job.parsedSkills.length === 0) {
              try {
                const skillResponse = await API.get(`/api/skills/job-details/${job._id}`);
                return {
                  ...job,
                  parsedSkills: skillResponse.data.data.parsedSkills,
                  skillsBreakdown: skillResponse.data.data.skillsBreakdown
                };
              } catch (err) {
                console.error(`Error parsing skills for job ${job._id}:`, err);
                return job;
              }
            }
            return job;
          })
        );

        setJobs(processedJobs);

        // Calculate matches for all jobs
        if (studentSkills.length > 0) {
          await calculateMatchesForAllJobs(processedJobs);
        }

        // Handle pre-selected job from location state
        if (location.state?.jobId) {
          const job = processedJobs.find(j => j._id === location.state.jobId);
          if (job) {
            setSelectedJob(job);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [location.state?.jobId]);

  // Calculate skill matches for all jobs
  const calculateMatchesForAllJobs = async (jobsToMatch) => {
    const newMatches = new Map();

    for (const job of jobsToMatch) {
      try {
        const matchResponse = await API.post('/api/skills/calculate-match', {
          resumeSkills: studentSkills,
          jobSkills: job.parsedSkills || job.skillsRequired || []
        });

        newMatches.set(job._id, {
          matchPercentage: matchResponse.data.data.matchPercentage,
          matchedSkills: matchResponse.data.data.matchedSkills,
          missingSkills: matchResponse.data.data.missingSkills,
          extraSkills: matchResponse.data.data.extraSkills,
          matchDetails: matchResponse.data.data
        });
      } catch (err) {
        console.error(`Error calculating match for job ${job._id}:`, err);
        newMatches.set(job._id, {
          matchPercentage: 0,
          matchedSkills: [],
          missingSkills: [],
          extraSkills: []
        });
      }
    }

    setJobMatches(newMatches);
  };

  // Filter and search jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const jobMatch = jobMatches.get(job._id);
    const matchesFilter = filterCategory === 'all' || 
                         (filterCategory === 'high' && jobMatch?.matchPercentage >= 70) ||
                         (filterCategory === 'medium' && jobMatch?.matchPercentage >= 40 && jobMatch?.matchPercentage < 70) ||
                         (filterCategory === 'low' && jobMatch?.matchPercentage < 40);

    return matchesSearch && matchesFilter;
  });

  // Get match percentage color
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-blue-50 border-blue-200';
    if (percentage >= 40) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getMatchTextColor = (percentage) => {
    if (percentage >= 80) return 'text-green-700';
    if (percentage >= 60) return 'text-blue-700';
    if (percentage >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getPercentageLabel = (percentage) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Zap className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-600 font-semibold">Loading jobs and analyzing your skills...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-700 text-center font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Matching & Roadmaps</h1>
            <p className="text-gray-600">
              Explore jobs matched to your skills. Percentage shows how well your skills align with job requirements.
            </p>
          </div>

          {/* Resume Skills Display */}
          {studentSkills.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  Your Parsed Resume Skills ({studentSkills.length})
                </h2>
                <button
                  onClick={() => setSkillsModal('resume')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                >
                  View Details
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {studentSkills.slice(0, 15).map((skill, idx) => (
                  <span key={idx} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {skill}
                  </span>
                ))}
                {studentSkills.length > 15 && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                    +{studentSkills.length - 15} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Search & Filter Section */}
          <div className="mb-6 flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Matches</option>
              <option value="high">High Match (70%+)</option>
              <option value="medium">Medium Match (40-70%)</option>
              <option value="low">Low Match (&lt;40%)</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewType('cards')}
                className={`px-4 py-3 rounded-lg font-semibold transition ${
                  viewType === 'cards'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`px-4 py-3 rounded-lg font-semibold transition ${
                  viewType === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-gray-600 font-semibold">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>

          {/* Jobs Cards/List View */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No jobs match your current filters.</p>
            </div>
          ) : (
            <div
              className={
                viewType === 'cards'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredJobs.map((job) => {
                const match = jobMatches.get(job._id) || { matchPercentage: 0 };
                const percentage = match.matchPercentage;

                return (
                  <div
                    key={job._id}
                    onClick={() => setSelectedJob(job)}
                    className={`${
                      viewType === 'cards'
                        ? 'rounded-lg shadow-md hover:shadow-xl p-6'
                        : 'flex items-center justify-between p-4 rounded-lg shadow-sm hover:shadow-md'
                    } cursor-pointer transition ${getMatchColor(percentage)} border-2`}
                  >
                    {/* Job Card Content */}
                    <div className={viewType === 'list' ? 'flex-1' : ''}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        {/* Percentage Badge */}
                        <div className={`flex flex-col items-center ${getMatchTextColor(percentage)}`}>
                          <div className="text-2xl font-bold">{percentage.toFixed(0)}%</div>
                          <div className="text-xs font-semibold text-center">Match</div>
                        </div>
                      </div>

                      {/* Location & Type */}
                      <div className="flex gap-2 mb-3 text-sm text-gray-600">
                        <span className="bg-white px-2 py-1 rounded">📍 {job.location}</span>
                        <span className="bg-white px-2 py-1 rounded">💼 {job.jobType}</span>
                      </div>

                      {/* Match Details */}
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-sm">
                        <div className="bg-green-100 rounded p-2">
                          <div className="font-bold text-green-700">{match.matchedSkills?.length || 0}</div>
                          <div className="text-xs text-green-600">Matched</div>
                        </div>
                        <div className="bg-yellow-100 rounded p-2">
                          <div className="font-bold text-yellow-700">{match.missingSkills?.length || 0}</div>
                          <div className="text-xs text-yellow-600">Missing</div>
                        </div>
                        <div className="bg-blue-100 rounded p-2">
                          <div className="font-bold text-blue-700">{job.parsedSkills?.length || job.skillsRequired?.length || 0}</div>
                          <div className="text-xs text-blue-600">Required</div>
                        </div>
                      </div>

                      {/* Match Label */}
                      <p className={`text-sm font-bold mb-3 ${getMatchTextColor(percentage)}`}>
                        {getPercentageLabel(percentage)}
                      </p>

                      {/* Skills Preview */}
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-gray-700 mb-1">Required Skills:</div>
                        <div className="flex flex-wrap gap-1">
                          {(job.parsedSkills || job.skillsRequired || []).slice(0, 4).map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {(job.parsedSkills || job.skillsRequired || []).length > 4 && (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                              +{(job.parsedSkills || job.skillsRequired || []).length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* View Details Button */}
                      {viewType === 'cards' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          View Details <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Job Details Modal */}
          {selectedJob && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="sticky top-0 bg-indigo-600 text-white p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                    <p className="text-indigo-100">{selectedJob.company}</p>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="p-2 hover:bg-indigo-700 rounded transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Percentage Match */}
                  <div className={`rounded-lg p-4 ${getMatchColor(jobMatches.get(selectedJob._id)?.matchPercentage || 0)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Match Percentage</p>
                        <p className={`text-3xl font-bold ${getMatchTextColor(jobMatches.get(selectedJob._id)?.matchPercentage || 0)}`}>
                          {jobMatches.get(selectedJob._id)?.matchPercentage?.toFixed(1) || 0}%
                        </p>
                      </div>
                      <p className={`text-lg font-bold ${getMatchTextColor(jobMatches.get(selectedJob._id)?.matchPercentage || 0)}`}>
                        {getPercentageLabel(jobMatches.get(selectedJob._id)?.matchPercentage || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Location</p>
                      <p className="text-gray-900">{selectedJob.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Job Type</p>
                      <p className="text-gray-900">{selectedJob.jobType}</p>
                    </div>
                    {selectedJob.salary?.min && (
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Salary Range</p>
                        <p className="text-gray-900">
                          {selectedJob.salary.min} - {selectedJob.salary.max} {selectedJob.salary.currency}
                        </p>
                      </div>
                    )}
                    {selectedJob.experience?.min !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Experience</p>
                        <p className="text-gray-900">
                          {selectedJob.experience.min} - {selectedJob.experience.max} years
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Matched Skills */}
                  {jobMatches.get(selectedJob._id)?.matchedSkills?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">✅ Your Matched Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {jobMatches.get(selectedJob._id).matchedSkills.map((skill, idx) => (
                          <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {jobMatches.get(selectedJob._id)?.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">❌ Missing Skills to Learn</p>
                      <div className="flex flex-wrap gap-2">
                        {jobMatches.get(selectedJob._id).missingSkills.map((skill, idx) => (
                          <span key={idx} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Description</p>
                    <p className="text-gray-700 line-clamp-3">{selectedJob.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => navigate('/student/learning-roadmap', { state: { job: selectedJob, skills: jobMatches.get(selectedJob._id)?.missingSkills } })}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                      View Learning Roadmap
                    </button>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 rounded-lg font-semibold transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentRoadmapsPage;

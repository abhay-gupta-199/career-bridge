import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, Zap, BookOpen, Layers, Rocket, Clock, Target, 
  TrendingUp, Code, CheckCircle2, AlertCircle, Loader2, GraduationCap
} from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import RoadmapGenerator from './RoadmapGenerator'
import GlassCard from '../../components/ui/GlassCard'
import AnimatedBadge from '../../components/ui/AnimatedBadge'
import API from '../../api/axios'

const StudentRoadmap = () => {
  const [activeTab, setActiveTab] = useState('jobs') // jobs | generate | view
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null)
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [error, setError] = useState(null)
  const [personalizedRoadmap, setPersonalizedRoadmap] = useState(null)

  // Fetch available jobs for personalized roadmap
  useEffect(() => {
    if (activeTab === 'jobs') {
      fetchJobs()
    }
  }, [activeTab])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await API.get('/student/jobs')
      setJobs(response.data)
    } catch (err) {
      setError('Failed to load jobs. Please try again.')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGeneratePersonalizedRoadmap = async (jobId) => {
    try {
      setRoadmapLoading(true)
      setError(null)
      
      console.log('Generating personalized roadmap for job:', jobId)
      const response = await API.post('/personalized-job-roadmap', { jobId })
      
      setPersonalizedRoadmap(response.data)
      setSelectedJob(jobId)
      setActiveTab('personalized-view')
    } catch (err) {
      setError('Failed to generate roadmap. Please try again.')
      console.error('Error generating roadmap:', err)
    } finally {
      setRoadmapLoading(false)
    }
  }

  const handleRoadmapGenerated = (data) => {
    setGeneratedRoadmap(data)
    setActiveTab('view')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="roadmaps" />
        <main className="flex-1 px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full">
                <MapPin className="text-purple-600" size={32} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900">Learning Roadmaps</h1>
                <p className="text-gray-600 text-lg">AI-powered personalized learning paths for your career</p>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeTab === 'jobs' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Rocket size={18} />
                Job-Specific Roadmaps
              </div>
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeTab === 'generate' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap size={18} />
                Custom Roadmap
              </div>
            </button>
            {generatedRoadmap && (
              <button
                onClick={() => setActiveTab('view')}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'view' 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  View Custom
                </div>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto">
            {/* Jobs Tab - Job-Specific Personalized Roadmaps */}
            {activeTab === 'jobs' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin text-purple-600" size={40} />
                  </div>
                ) : error ? (
                  <GlassCard className="p-6 bg-red-50 border border-red-200">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="text-red-600" size={24} />
                      <div>
                        <h3 className="font-bold text-red-900">Error</h3>
                        <p className="text-red-700">{error}</p>
                      </div>
                    </div>
                  </GlassCard>
                ) : jobs.length === 0 ? (
                  <GlassCard className="p-8 text-center">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Jobs Available</h3>
                    <p className="text-gray-600">
                      Check back later for job listings, or create a custom roadmap to start learning.
                    </p>
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => {
                      const matchPercentage = job.studentMatch?.matchPercentage || 0
                      const isHighMatch = matchPercentage >= 75
                      const isMediumMatch = matchPercentage >= 50
                      
                      return (
                        <motion.div
                          key={job._id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-full"
                        >
                          <GlassCard className={`p-6 h-full flex flex-col transition-all ${
                            isHighMatch 
                              ? 'border-2 border-green-400 shadow-lg' 
                              : isMediumMatch 
                              ? 'border-2 border-yellow-400'
                              : 'border-2 border-gray-200'
                          }`}>
                            {/* Match Badge */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                                <p className="text-sm text-gray-600">{job.company}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                isHighMatch 
                                  ? 'bg-green-100 text-green-700' 
                                  : isMediumMatch 
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {matchPercentage}%
                              </div>
                            </div>

                            {/* Match Skills */}
                            <div className="space-y-3 mb-4 flex-1">
                              {job.studentMatch?.matched_skills && job.studentMatch.matched_skills.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                                    <CheckCircle2 size={14} />
                                    Matched: {job.studentMatch.matched_skills.length}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {job.studentMatch.matched_skills.slice(0, 3).map((skill, i) => (
                                      <span key={i} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        {skill}
                                      </span>
                                    ))}
                                    {job.studentMatch.matched_skills.length > 3 && (
                                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        +{job.studentMatch.matched_skills.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {job.studentMatch?.missing_skills && job.studentMatch.missing_skills.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    Missing: {job.studentMatch.missing_skills.length}
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {job.studentMatch.missing_skills.slice(0, 3).map((skill, i) => (
                                      <span key={i} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                        {skill}
                                      </span>
                                    ))}
                                    {job.studentMatch.missing_skills.length > 3 && (
                                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                        +{job.studentMatch.missing_skills.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Location & Deadline */}
                            <div className="space-y-2 mb-4 text-xs text-gray-600 border-t border-gray-100 pt-4">
                              <p className="flex items-center gap-2">
                                <MapPin size={14} />
                                {job.location || 'Remote'}
                              </p>
                              {job.applicationDeadline && (
                                <p className="flex items-center gap-2">
                                  <Clock size={14} />
                                  Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                                </p>
                              )}
                            </div>

                            {/* Generate Roadmap Button */}
                            <button
                              onClick={() => handleGeneratePersonalizedRoadmap(job._id)}
                              disabled={roadmapLoading && selectedJob === job._id}
                              className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                                roadmapLoading && selectedJob === job._id
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                              }`}
                            >
                              {roadmapLoading && selectedJob === job._id ? (
                                <>
                                  <Loader2 size={16} className="animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Target size={16} />
                                  Generate Roadmap
                                </>
                              )}
                            </button>
                          </GlassCard>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Personalized Roadmap View */}
            {activeTab === 'personalized-view' && personalizedRoadmap && (
              <PersonalizedRoadmapView 
                roadmap={personalizedRoadmap}
                onBack={() => setActiveTab('jobs')}
              />
            )}

            {/* Custom Roadmap Generator Tab */}
            {activeTab === 'generate' && (
              <RoadmapGenerator onGenerate={handleRoadmapGenerated} />
            )}

            {/* View Generated Custom Roadmap */}
            {activeTab === 'view' && generatedRoadmap && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Roadmap Title Card */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                  <h2 className="text-3xl font-bold mb-2">{generatedRoadmap.title}</h2>
                  <p className="text-purple-100 text-lg opacity-90">{generatedRoadmap.description}</p>
                </div>

                {/* Phases Timeline */}
                <div className="relative border-l-4 border-purple-200 ml-6 space-y-12 pl-8 py-4">
                  {generatedRoadmap.phases?.map((phase, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[46px] top-0 w-8 h-8 rounded-full bg-purple-600 border-4 border-purple-100 flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>

                      <GlassCard className="p-6 hover:scale-[1.01] transition-transform duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                          <h3 className="text-2xl font-bold text-gray-800">{phase.name}</h3>
                          <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {phase.duration}
                          </span>
                        </div>

                        <div className="space-y-6">
                          {phase.topics?.map((topic, tIdx) => (
                            <div key={tIdx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                                <BookOpen size={18} className="text-blue-500" />
                                {topic.topic}
                              </h4>
                              <p className="text-gray-600 mb-3 ml-7">{topic.description}</p>

                              {topic.resources?.length > 0 && (
                                <div className="ml-7 flex flex-wrap gap-2">
                                  {topic.resources.map((res, rIdx) => (
                                    <a
                                      key={rIdx}
                                      href={res.includes('http') ? res : `https://www.google.com/search?q=${res}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-3 py-1 bg-white text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-1"
                                    >
                                      RESOURCE
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Personalized Roadmap View Component
const PersonalizedRoadmapView = ({ roadmap, onBack }) => {
  if (!roadmap || !roadmap.roadmap) {
    return (
      <GlassCard className="p-8 text-center">
        <AlertCircle className="mx-auto text-red-600 mb-4" size={48} />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Roadmap Error</h3>
        <p className="text-gray-600 mb-6">Unable to load the personalized roadmap.</p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Go Back
        </button>
      </GlassCard>
    )
  }

  const { roadmap: rm, job, timeline, learning_strategy } = roadmap
  const skillRoadmaps = rm.skill_roadmaps || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Job Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition-colors"
        >
          ← Back to Jobs
        </button>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h2>
        <p className="text-purple-100 text-lg opacity-90">{job.company}</p>
        {job.daysRemaining && (
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold bg-white/20 w-fit px-4 py-2 rounded-full">
            <Clock size={16} />
            {job.daysRemaining} days to prepare
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {rm.analysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{rm.analysis.matched_count}</div>
            <p className="text-sm text-gray-600">Matched Skills</p>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{rm.analysis.missing_count}</div>
            <p className="text-sm text-gray-600">Skills to Learn</p>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{rm.analysis.match_percentage}%</div>
            <p className="text-sm text-gray-600">Overall Match</p>
          </GlassCard>
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{timeline?.total_days || 30}</div>
            <p className="text-sm text-gray-600">Days Available</p>
          </GlassCard>
        </div>
      )}

      {/* Learning Strategy */}
      {learning_strategy && (
        <GlassCard className="p-8 border-l-4 border-purple-600 bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-600" />
            Learning Strategy
          </h3>
          <p className="text-gray-700 mb-4">{learning_strategy.rationale}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Approach</p>
              <p className="font-bold text-gray-900">{learning_strategy.approach}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Parallel Streams</p>
              <p className="font-bold text-gray-900">{learning_strategy.parallel_streams} streams</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Daily Commitment</p>
              <p className="font-bold text-gray-900">{timeline?.learning_hours_per_day || 4} hours/day</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Skills Roadmaps */}
      <div className="space-y-8">
        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Code className="text-purple-600" />
          Detailed Learning Path
        </h3>

        {skillRoadmaps.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h4 className="text-xl font-bold text-gray-800">Great News!</h4>
            <p className="text-gray-600 mt-2">
              Your skills already match this job. Keep improving and apply!
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {skillRoadmaps.map((skillRm, idx) => (
              <SkillRoadmapCard key={idx} skillRoadmap={skillRm} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* Weekly Schedule Template */}
      {roadmap.roadmap.weekly_schedule_template && (
        <WeeklyScheduleTemplate template={roadmap.roadmap.weekly_schedule_template} />
      )}

      {/* Success Metrics */}
      {roadmap.roadmap.success_metrics && (
        <SuccessMetrics metrics={roadmap.roadmap.success_metrics} />
      )}

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
        >
          ← Back to Jobs
        </button>
      </div>
    </motion.div>
  )
}

// Skill Roadmap Card
const SkillRoadmapCard = ({ skillRoadmap, index }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard className="p-6 cursor-pointer hover:shadow-lg transition-all" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              {skillRoadmap.skill}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Complexity: <span className="font-bold">{skillRoadmap.complexity ? 'Hard' : 'Medium'}</span> •
              Stream {skillRoadmap.parallel_stream} • {skillRoadmap.estimated_days} days
            </p>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDownIcon />
          </motion.div>
        </div>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-4 border-t border-gray-200 pt-6"
          >
            {skillRoadmap.subtopics?.map((subtopic, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-bold text-gray-900">{subtopic.title}</h5>
                  <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded-full font-semibold">
                    {subtopic.estimated_days} days
                  </span>
                </div>

                {subtopic.resources && (
                  <div className="space-y-2">
                    {Object.entries(subtopic.resources).map(([type, urls]) => (
                      urls && urls.length > 0 && (
                        <div key={type}>
                          <p className="text-xs font-semibold text-gray-700 mb-1 capitalize">{type}:</p>
                          <div className="flex flex-wrap gap-1">
                            {urls.slice(0, 2).map((url, i) => (
                              <a
                                key={i}
                                href={url.includes('http') ? url : `https://www.google.com/search?q=${url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-2 py-1 bg-white text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                              >
                                Link {i + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {subtopic.practice_projects && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Practice:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {subtopic.practice_projects.map((proj, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-purple-600">•</span>
                          {proj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  )
}

// Weekly Schedule Template
const WeeklyScheduleTemplate = ({ template }) => {
  return (
    <GlassCard className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="text-blue-600" />
        Weekly Schedule Template
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-8">
        {Object.entries(template.sample_week_structure || {}).map(([day, activity]) => (
          <div key={day} className="bg-white p-4 rounded-lg border border-blue-100">
            <p className="font-bold text-blue-600 text-sm mb-2 capitalize">{day}</p>
            <p className="text-xs text-gray-700">{activity}</p>
          </div>
        ))}
      </div>

      {template.daily_routine && (
        <div className="bg-white p-6 rounded-lg border border-blue-200">
          <h4 className="font-bold text-gray-900 mb-4">Daily Routine (Sample)</h4>
          <div className="space-y-3">
            {Object.entries(template.daily_routine).map(([time, activity]) => (
              <div key={time} className="flex justify-between items-start">
                <p className="font-semibold text-gray-700 capitalize">{time.replace(/_/g, ' ')}:</p>
                <p className="text-gray-600 text-right flex-1 ml-4">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  )
}

// Success Metrics
const SuccessMetrics = ({ metrics }) => {
  return (
    <GlassCard className="p-8 bg-gradient-to-r from-green-50 to-emerald-50">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CheckCircle2 className="text-green-600" />
        Success Metrics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Minimum Competency</h4>
          <p className="text-gray-700">{metrics.minimum_competency}</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-3">Target Competency</h4>
          <p className="text-gray-700">{metrics.target_competency}</p>
        </div>
      </div>

      {metrics.success_criteria && (
        <div className="mt-6">
          <h4 className="font-bold text-gray-900 mb-3">Success Criteria</h4>
          <ul className="space-y-2">
            {metrics.success_criteria.map((criterion, idx) => (
              <li key={idx} className="flex gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={18} />
                <span className="text-gray-700">{criterion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GlassCard>
  )
}

const ChevronDownIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
)

export default StudentRoadmap

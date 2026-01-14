import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Github,
  Youtube,
  FileText,
  CheckCircle2,
  Clock,
  Target,
  ArrowLeft,
  ExternalLink,
  Code2,
  Briefcase
} from 'lucide-react';

const RoadmapDetailPage = ({ roadmap, onBack }) => {
  const [expandedSkills, setExpandedSkills] = useState({});
  const [completedSkills, setCompletedSkills] = useState({});

  const toggleSkill = (skillName) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };

  const toggleComplete = (skillName) => {
    setCompletedSkills(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading roadmap...</p>
      </div>
    );
  }

  const jobInfo = roadmap.job || {};
  const missingSkills = roadmap.missing_skills || [];
  const roadmapData = roadmap.roadmap || {};
  const daysLeft = roadmap.days_left || 14;

  const totalSkills = Object.keys(roadmapData).length;
  const completedSkillsCount = Object.keys(completedSkills).filter(s => completedSkills[s]).length;
  const progressPercentage = totalSkills > 0 ? (completedSkillsCount / totalSkills) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Back Button */}
      <motion.button
        whileHover={{ x: -5 }}
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Roadmaps
      </motion.button>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-8 mb-8 shadow-xl"
      >
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-2">{jobInfo.title}</h1>
          <p className="text-blue-100 text-lg mb-6">{jobInfo.company}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-blue-100 text-sm font-medium mb-1">Days Available</p>
              <p className="text-3xl font-bold">{daysLeft}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-blue-100 text-sm font-medium mb-1">Skills to Learn</p>
              <p className="text-3xl font-bold">{missingSkills.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-blue-100 text-sm font-medium mb-1">Your Progress</p>
              <p className="text-3xl font-bold">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
          <span className="text-2xl font-bold text-purple-600">
            {completedSkillsCount}/{totalSkills}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-gradient-to-r from-green-400 to-blue-600 h-full rounded-full"
          />
        </div>
      </motion.div>

      {/* Skills Roadmap */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Roadmap</h2>

        {Object.entries(roadmapData).map(([skillName, skillData], idx) => (
          <motion.div
            key={skillName}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-blue-500 hover:shadow-xl transition-all"
          >
            {/* Skill Header */}
            <button
              onClick={() => toggleSkill(skillName)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                <div className="flex-shrink-0">
                  {completedSkills[skillName] ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="text-green-600" size={20} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="text-blue-600" size={20} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{skillName}</h3>
                  <p className="text-sm text-gray-600">
                    {skillData.duration_days
                      ? `Estimated: ${skillData.duration_days} days`
                      : skillData.duration_weeks
                      ? `Estimated: ${skillData.duration_weeks} weeks`
                      : 'Self-paced'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(skillName);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    completedSkills[skillName]
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                  }`}
                >
                  {completedSkills[skillName] ? '✓ Completed' : 'Mark Done'}
                </button>
                {expandedSkills[skillName] ? (
                  <ChevronUp className="text-gray-600" size={24} />
                ) : (
                  <ChevronDown className="text-gray-600" size={24} />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {expandedSkills[skillName] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 p-6 space-y-6 bg-gray-50"
              >
                {/* Subtopics */}
                {skillData.subtopics && skillData.subtopics.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen size={20} />
                      Learning Modules
                    </h4>
                    <div className="space-y-4">
                      {skillData.subtopics.map((subtopic, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-gray-900">{subtopic.title}</h5>
                            {subtopic.estimated_days && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {subtopic.estimated_days}d
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{subtopic.project}</p>

                          {/* Resources */}
                          <div className="space-y-2">
                            {subtopic.youtube_links && subtopic.youtube_links.length > 0 && (
                              <div>
                                <a
                                  href={subtopic.youtube_links[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
                                >
                                  <Youtube size={16} />
                                  Watch Tutorials
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                            )}

                            {subtopic.docs && subtopic.docs.length > 0 && (
                              <div>
                                <a
                                  href={subtopic.docs[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                  <FileText size={16} />
                                  Official Documentation
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                            )}

                            {subtopic.github && subtopic.github.length > 0 && (
                              <div>
                                <a
                                  href={subtopic.github[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-gray-800 hover:text-gray-900 font-medium text-sm"
                                >
                                  <Github size={16} />
                                  Example Projects
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Projects */}
                {skillData.final_projects && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase size={20} />
                      Capstone Projects
                    </h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <ul className="space-y-2">
                        {skillData.final_projects.suggested &&
                          skillData.final_projects.suggested.map((project, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Code2 size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{project}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 bg-gradient-to-r from-green-400 to-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl"
        >
          <CheckCircle2 size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">🎉 Roadmap Complete!</h3>
          <p className="text-green-100">You've successfully completed all the required skills for this role!</p>
        </motion.div>
      )}
    </div>
  );
};

export default RoadmapDetailPage;

import { motion } from 'framer-motion';
import { BookOpen, Clock, Target, ArrowRight, Zap } from 'lucide-react';

const RoadmapCard = ({ job, index, onSelect }) => {
  const getSkillCount = (jobData) => {
    return jobData?.missingSkills?.length || 0;
  };

  const getDaysLeft = (jobData) => {
    return jobData?.daysLeft || 14;
  };

  const getDifficultyColor = (count) => {
    if (count <= 2) return 'from-green-400 to-emerald-600';
    if (count <= 4) return 'from-blue-400 to-cyan-600';
    return 'from-orange-400 to-red-600';
  };

  const getDifficultyLabel = (count) => {
    if (count <= 2) return 'Easy';
    if (count <= 4) return 'Medium';
    return 'Challenging';
  };

  const skillCount = getSkillCount(job);
  const daysLeft = getDaysLeft(job);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      onClick={() => onSelect(job)}
      className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Header with Gradient */}
      <div className={`bg-gradient-to-r ${getDifficultyColor(skillCount)} p-6 text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold">{job.title || 'Roadmap'}</h3>
            <p className="text-sm opacity-90">{job.company || 'Career Growth'}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-sm font-semibold">{getDifficultyLabel(skillCount)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Skills to Learn */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Skills to Learn</p>
            <p className="text-2xl font-bold text-gray-900">{skillCount}</p>
          </div>
        </div>

        {/* Time Available */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Clock size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Days Available</p>
            <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Difficulty Level</p>
            <div className="flex items-center gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i < Math.ceil(skillCount / 2) ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Missing Skills Preview */}
        {job.missingSkills && job.missingSkills.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 font-semibold mb-2">Missing Skills:</p>
            <div className="flex flex-wrap gap-2">
              {job.missingSkills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
              {job.missingSkills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                  +{job.missingSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 group">
          <Zap size={18} className="group-hover:animate-pulse" />
          Start Learning Path
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default RoadmapCard;

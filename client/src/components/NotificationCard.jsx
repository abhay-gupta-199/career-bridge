import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Briefcase, X } from 'lucide-react';

/**
 * NotificationCard Component
 * Displays a single job match notification with:
 * - Job title, company, location
 * - Match percentage badge (green if >= 60%)
 * - Matched and unmatched skills with colored chips
 * - Action buttons to view/apply
 */
const NotificationCard = ({ notification, onClose, onApply }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const matchPercentage = notification.matchPercentage || 0;
  const isHighMatch = matchPercentage >= 75; // consider high match >= 75%
  const matchColor = isHighMatch ? 'from-green-500 to-emerald-600' : 'from-yellow-400 to-orange-500';
  const badgeBg = isHighMatch ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

  const matchedSkills = notification.matchedSkills || [];
  const unmatchedSkills = notification.unmatchedSkills || [];
  
  // ML Scoring from recommender
  const hybridScore = notification.hybridScore ? (notification.hybridScore * 100).toFixed(1) : null;
  const semanticScore = notification.semanticScore ? (notification.semanticScore * 100).toFixed(1) : null;
  const tfidfScore = notification.tfidfScore ? (notification.tfidfScore * 100).toFixed(1) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 border-l-4 border-blue-500"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition"
        title="Close notification"
      >
        <X size={18} className="text-gray-400" />
      </button>

      {/* Header with Job Info and Match Badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={20} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
              {notification.job?.title || 'Job Opportunity'}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {notification.job?.company || 'Company'} • {notification.job?.location || 'Location'}
          </p>
        </div>

        {/* Match Percentage Badge */}
        <motion.div
          className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${matchColor} text-white font-bold text-lg shadow-lg flex-shrink-0`}
          whileHover={{ scale: 1.05 }}
        >
          {matchPercentage}%
        </motion.div>
      </div>

      {/* Match Status Indicator */}
      <div className="flex items-center gap-2 mb-4">
        {isHighMatch ? (
          <>
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-600">Excellent Match!</span>
          </>
        ) : (
          <>
            <AlertCircle size={16} className="text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Consider learning missing skills</span>
          </>
        )}
      </div>

      {/* ML Scoring Metrics */}
      {(hybridScore || semanticScore || tfidfScore) && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs font-bold text-purple-900 uppercase mb-2">ML Matching Scores</p>
          <div className="flex gap-4 flex-wrap">
            {hybridScore && (
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-purple-700">{hybridScore}%</span>
                <span className="text-xs text-purple-600">Hybrid</span>
              </div>
            )}
            {semanticScore && (
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-blue-700">{semanticScore}%</span>
                <span className="text-xs text-blue-600">Semantic</span>
              </div>
            )}
            {tfidfScore && (
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-green-700">{tfidfScore}%</span>
                <span className="text-xs text-green-600">TF-IDF</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills Section */}
      <div className="space-y-3 mb-4">
        {/* Matched Skills */}
        {matchedSkills.length > 0 && (
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase block mb-2">
              ✅ Matched Skills ({matchedSkills.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.slice(0, isExpanded ? undefined : 3).map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                >
                  {skill}
                </motion.span>
              ))}
              {!isExpanded && matchedSkills.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{matchedSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Unmatched Skills */}
        {unmatchedSkills.length > 0 && (
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase block mb-2">
              📚 Skills to Learn ({unmatchedSkills.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {unmatchedSkills.slice(0, isExpanded ? undefined : 3).map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"
                >
                  {skill}
                </motion.span>
              ))}
              {!isExpanded && unmatchedSkills.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{unmatchedSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expand/Collapse Button */}
      {(matchedSkills.length > 3 || unmatchedSkills.length > 3) && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 mb-3 transition"
        >
          {isExpanded ? '← Show less' : 'Show more →'}
        </button>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onApply(notification.job._id)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:shadow-lg transition"
        >
          Apply Now
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition"
        >
          View Details
        </motion.button>
      </div>

      {/* Timestamp */}
      <p className="text-xs text-gray-400 mt-3">
        {notification.createdAt 
          ? new Date(notification.createdAt).toLocaleDateString()
          : 'Just now'
        }
      </p>

      {/* Read Status Indicator */}
      {!notification.isRead && (
        <div className="absolute top-2 right-12 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}
    </motion.div>
  );
};

export default NotificationCard;

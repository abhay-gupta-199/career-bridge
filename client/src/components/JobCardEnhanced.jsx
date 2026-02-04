import React from 'react';
import { ChevronRight, Tag, TrendingUp } from 'lucide-react';

/**
 * Enhanced Job Card Component
 * Displays job with percentage match and skill breakdown
 */

const JobCard = ({
  job,
  matchPercentage = 0,
  matchedSkills = [],
  missingSkills = [],
  onClick,
  onViewDetails
}) => {
  // Get color based on match percentage
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', bar: 'bg-green-500' };
    if (percentage >= 60) return { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', bar: 'bg-blue-500' };
    if (percentage >= 40) return { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', bar: 'bg-yellow-500' };
    return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', bar: 'bg-red-500' };
  };

  const getMatchLabel = (percentage) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  const colors = getMatchColor(matchPercentage);

  return (
    <div
      onClick={onClick}
      className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 cursor-pointer transition hover:shadow-lg transform hover:scale-105 duration-200`}
    >
      {/* Header with percentage badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-sm text-gray-600 font-semibold">{job.company}</p>
        </div>

        {/* Circular Percentage Badge */}
        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full ${colors.bg} border-2 ${colors.border}`}>
          <div className={`text-2xl font-bold ${colors.text}`}>
            {matchPercentage.toFixed(0)}%
          </div>
          <div className="text-xs font-bold text-gray-600">Match</div>
        </div>
      </div>

      {/* Location and Job Type */}
      <div className="flex gap-2 mb-4 text-xs">
        <span className="bg-white px-2 py-1 rounded font-semibold text-gray-700">📍 {job.location || 'Remote'}</span>
        <span className="bg-white px-2 py-1 rounded font-semibold text-gray-700">💼 {job.jobType || 'Full-time'}</span>
      </div>

      {/* Match Status Bar */}
      <div className="mb-4">
        {/* Main Hybrid Score */}
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm font-bold ${colors.text}`}>{getMatchLabel(matchPercentage)}</span>
          <span className="text-sm font-bold text-gray-700">{matchPercentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-3">
          <div
            className={`h-full ${colors.bar} transition-all duration-300`}
            style={{ width: `${matchPercentage}%` }}
          />
        </div>

        {/* Detailed Breakdown - Clean minimal style */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {/* Semantic */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
              <span>Semantic</span>
              <span>{(job.semanticPercentage || 0).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-purple-400 transition-all duration-300"
                style={{ width: `${job.semanticPercentage || 0}%` }}
              />
            </div>
          </div>

          {/* Keywords */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
              <span>Keywords</span>
              <span>{(job.tfidfPercentage || 0).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-blue-400 transition-all duration-300"
                style={{ width: `${job.tfidfPercentage || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skill Statistics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white rounded p-2 border border-green-300">
          <div className="text-sm font-bold text-green-700">{matchedSkills.length}</div>
          <div className="text-xs text-green-600 font-semibold">Matched</div>
        </div>
        <div className="bg-white rounded p-2 border border-yellow-300">
          <div className="text-sm font-bold text-yellow-700">{missingSkills.length}</div>
          <div className="text-xs text-yellow-600 font-semibold">Missing</div>
        </div>
        <div className="bg-white rounded p-2 border border-blue-300">
          <div className="text-sm font-bold text-blue-700">{(job.parsedSkills?.length || job.skillsRequired?.length || 0)}</div>
          <div className="text-xs text-blue-600 font-semibold">Required</div>
        </div>
      </div>

      {/* Matched Skills Display */}
      {matchedSkills.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
            <span className="text-green-600">✓</span> Your Skills
          </div>
          <div className="flex flex-wrap gap-1">
            {matchedSkills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-semibold"
              >
                {skill}
              </span>
            ))}
            {matchedSkills.length > 3 && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                +{matchedSkills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Missing Skills Display */}
      {missingSkills.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
            <span className="text-red-600">✗</span> Skills to Learn
          </div>
          <div className="flex flex-wrap gap-1">
            {missingSkills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold"
              >
                {skill}
              </span>
            ))}
            {missingSkills.length > 3 && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                +{missingSkills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* View Details Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails && onViewDetails(job);
        }}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2"
      >
        View Details <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default JobCard;

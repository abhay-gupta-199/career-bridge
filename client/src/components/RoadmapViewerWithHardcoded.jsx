// Hardcoded Roadmaps Integration - Frontend Examples
// This file shows how to use the hardcoded roadmaps in React components

// ============================================
// 1. API Hook for Fetching Roadmaps
// ============================================

export const useHardcodedRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoadmaps = useCallback(async (missingSkills) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/roadmaps/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          missingSkills,
          role: 'Full Stack Developer',
          availability: 10,
          duration: 6
        })
      });

      const data = await response.json();
      if (data.success) {
        setRoadmaps(data.roadmaps);
      } else {
        setError(data.message || 'Failed to fetch roadmaps');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { roadmaps, loading, error, fetchRoadmaps };
};

// ============================================
// 2. Roadmap Viewer Component
// ============================================

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code,
  Trophy,
  Clock,
  Target
} from 'lucide-react';

const RoadmapViewer = ({ skill, roadmap }) => {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);

  const togglePhase = (index) => {
    setExpandedPhase(expandedPhase === index ? null : index);
  };

  const toggleTopic = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{roadmap.title}</h1>
            <p className="text-gray-600 mt-2">{roadmap.description}</p>
          </div>
          {roadmap.isHardcoded && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Curated Roadmap
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{roadmap.totalDays} days ({Math.ceil(roadmap.totalDays / 7)} weeks)</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="capitalize">{roadmap.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {roadmap.phases?.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="border rounded-lg overflow-hidden">
            {/* Phase Header */}
            <button
              onClick={() => togglePhase(phaseIndex)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 
                         flex items-center justify-between hover:bg-blue-200 transition"
            >
              <div className="text-left">
                <h3 className="font-bold text-gray-900">{phase.name}</h3>
                <p className="text-sm text-gray-600">{phase.description}</p>
              </div>
              {expandedPhase === phaseIndex ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {/* Phase Content */}
            {expandedPhase === phaseIndex && (
              <div className="p-4 bg-gray-50 space-y-4">
                {phase.topics?.map((topic, topicIndex) => {
                  const topicId = `${phaseIndex}-${topicIndex}`;
                  return (
                    <div key={topicId} className="bg-white rounded border">
                      {/* Topic Header */}
                      <button
                        onClick={() => toggleTopic(topicId)}
                        className="w-full px-4 py-3 flex items-center justify-between 
                                   hover:bg-gray-100 transition"
                      >
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900">
                            {topic.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {topic.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            {topic.daysToComplete && (
                              <span className="text-gray-500">
                                ⏱️ {topic.daysToComplete} days
                              </span>
                            )}
                            {topic.subtopics?.length > 0 && (
                              <span className="text-gray-500">
                                📚 {topic.subtopics.length} subtopics
                              </span>
                            )}
                          </div>
                        </div>
                        {expandedTopic === topicId ? (
                          <ChevronUp className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 flex-shrink-0" />
                        )}
                      </button>

                      {/* Topic Content */}
                      {expandedTopic === topicId && (
                        <div className="px-4 py-3 bg-gray-50 border-t space-y-3">
                          {/* Subtopics */}
                          {topic.subtopics?.map((subtopic, subIndex) => (
                            <div key={subIndex} className="pl-4">
                              <h5 className="font-medium text-gray-900">
                                {subtopic.name}
                              </h5>
                              {subtopic.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {subtopic.description}
                                </p>
                              )}
                              {subtopic.keyPoints?.length > 0 && (
                                <ul className="mt-2 space-y-1 text-sm">
                                  {subtopic.keyPoints.map((point, idx) => (
                                    <li key={idx} className="text-gray-700">
                                      • {point}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}

                          {/* Resources */}
                          {topic.resources?.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <h5 className="font-medium text-gray-900 mb-2">
                                📚 Resources
                              </h5>
                              <ul className="space-y-2">
                                {topic.resources.map((resource, idx) => (
                                  <li key={idx}>
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 
                                               hover:underline text-sm"
                                    >
                                      {resource.title}
                                      {resource.type && (
                                        <span className="text-gray-500 ml-2">
                                          ({resource.type})
                                        </span>
                                      )}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Projects Section */}
      {roadmap.projects?.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Hands-On Projects
          </h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {roadmap.projects.map((project, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-purple-50 to-blue-50 
                           rounded-lg p-4 border border-purple-200"
              >
                <div className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {project.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {project.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-block px-2 py-1 bg-purple-100 
                                     text-purple-800 rounded text-xs font-medium">
                        {project.difficulty}
                      </span>
                      {project.skills?.length > 0 && (
                        <span className="text-xs text-gray-600">
                          Skills: {project.skills.slice(0, 2).join(', ')}
                          {project.skills.length > 2 && '...'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// 3. Multiple Roadmaps Display
// ============================================

const MultiRoadmapViewer = ({ roadmaps, loading, error }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  if (!roadmaps || Object.keys(roadmaps).length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        No roadmaps available
      </div>
    );
  }

  const skillsArray = Object.entries(roadmaps);

  return (
    <div className="space-y-6">
      {/* Skill Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {skillsArray.map(([skill, roadmap]) => (
          <button
            key={skill}
            onClick={() => setSelectedSkill(skill)}
            className={`p-4 rounded-lg font-semibold transition ${
              selectedSkill === skill
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Selected Roadmap Display */}
      {selectedSkill && roadmaps[selectedSkill] && (
        <RoadmapViewer
          skill={selectedSkill}
          roadmap={roadmaps[selectedSkill]}
        />
      )}
    </div>
  );
};

export default MultiRoadmapViewer;

// ============================================
// 4. Usage in Page Component
// ============================================

/*

import React, { useEffect } from 'react';
import MultiRoadmapViewer, { useHardcodedRoadmaps } from './components/RoadmapViewer';

function StudentRoadmapPage() {
  const { roadmaps, loading, error, fetchRoadmaps } = useHardcodedRoadmaps();

  useEffect(() => {
    // Fetch roadmaps for missing skills
    fetchRoadmaps(['Python', 'AWS', 'CSS']);
  }, [fetchRoadmaps]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Your Learning Roadmaps
      </h1>
      <MultiRoadmapViewer 
        roadmaps={roadmaps} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
}

export default StudentRoadmapPage;

*/

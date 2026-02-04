import React, { useState, useEffect } from 'react';
import { RoadmapCardView, RoadmapFlowViewer, MultiSkillFlowViewer } from './RoadmapFlowViewer';
import { BookOpen, Zap, Eye, Layout, Grid, Share2, Download } from 'lucide-react';

/**
 * 🎨 Complete Demo & Integration Component
 * Shows both Card View and Flow View with interactive switching
 * 
 * Usage:
 * <RoadmapDemo roadmaps={roadmapsFromAPI} />
 */

export const RoadmapDemo = ({ roadmaps: initialRoadmaps }) => {
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps || {});
  const [viewType, setViewType] = useState('cards');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch roadmaps if not provided
  useEffect(() => {
    if (!initialRoadmaps || Object.keys(initialRoadmaps).length === 0) {
      fetchRoadmaps();
    } else {
      setSelectedSkill(Object.keys(initialRoadmaps)[0]);
    }
  }, []);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      // Example API call - adjust endpoint as needed
      const response = await fetch('/api/roadmaps/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missingSkills: ['Python', 'JavaScript', 'CSS', 'AWS', 'Azure']
        })
      });

      if (!response.ok) throw new Error('Failed to fetch roadmaps');

      const data = await response.json();
      setRoadmaps(data.roadmaps || {});
      setSelectedSkill(Object.keys(data.roadmaps || {})[0]);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const skills = Object.keys(roadmaps);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 animate-spin">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Roadmaps</h2>
          <p className="text-gray-600">Preparing personalized learning paths...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Roadmaps</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchRoadmaps}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Roadmaps Available</h2>
          <p className="text-gray-600 mb-6">Roadmaps will appear here once they are generated</p>
          <button
            onClick={fetchRoadmaps}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Generate Roadmaps
          </button>
        </div>
      </div>
    );
  }

  const currentRoadmap = selectedSkill ? roadmaps[selectedSkill] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          {/* Main Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                📚 Learning Roadmaps
              </h1>
              <p className="text-gray-600 mt-1">Master new skills with structured learning paths</p>
            </div>
            <div className="flex gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                <Download className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewType('cards')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                  viewType === 'cards'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layout className="w-4 h-4" />
                Card View
              </button>
              <button
                onClick={() => setViewType('flow')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                  viewType === 'flow'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                Flow View
              </button>
              <button
                onClick={() => setViewType('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all ${
                  viewType === 'grid'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                All Skills
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-bold text-gray-900">{skills.length}</span>
                <span className="text-gray-600"> skills available</span>
              </div>
              {currentRoadmap && (
                <>
                  <div className="text-sm">
                    <span className="font-bold text-blue-600">{currentRoadmap.totalDays}</span>
                    <span className="text-gray-600"> days</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Skill Navigation */}
          {viewType !== 'grid' && (
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedSkill === skill
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-blue-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {viewType === 'cards' && currentRoadmap && (
          <div className="animate-fadeIn">
            <RoadmapCardView skill={selectedSkill} roadmap={currentRoadmap} />
          </div>
        )}

        {viewType === 'flow' && currentRoadmap && (
          <div className="h-[calc(100vh-200px)]">
            <RoadmapFlowViewer skill={selectedSkill} roadmap={currentRoadmap} />
          </div>
        )}

        {viewType === 'grid' && (
          <div className="px-6">
            <MultiSkillFlowViewer roadmaps={roadmaps} viewType="cards" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">🎯 Get Started</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✅ Choose a skill</li>
                <li>✅ Follow the phases</li>
                <li>✅ Complete projects</li>
                <li>✅ Track progress</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">💡 Tips</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Use flow view to see connections</li>
                <li>• Click cards to explore topics</li>
                <li>• Follow external resources</li>
                <li>• Complete hands-on projects</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">📊 Statistics</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Total Skills: <span className="font-bold">{skills.length}</span></div>
                <div>
                  Total Days: <span className="font-bold">
                    {Object.values(roadmaps).reduce((sum, r) => sum + (r.totalDays || 0), 0)}
                  </span>
                </div>
                <div>
                  Total Topics: <span className="font-bold">
                    {Object.values(roadmaps).reduce((sum, r) => 
                      sum + (r.phases?.reduce((pSum, p) => pSum + (p.topics?.length || 0), 0) || 0)
                    , 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
            <p>© 2025 Career Bridge - Structured Learning for Your Future</p>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default RoadmapDemo;

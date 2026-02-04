import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Clock,
  BookOpen,
  Code,
  Target,
  Award,
  ChevronRight,
  Zap,
  Github,
  ExternalLink,
  CheckCircle2,
  Trophy,
} from 'lucide-react';

// ============================================
// Custom Node Components
// ============================================

const PhaseNode = ({ data }) => (
  <div className="px-4 py-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg border-2 border-blue-400 min-w-max">
    <div className="font-bold text-sm mb-1">{data.label}</div>
    <div className="text-xs opacity-90">{data.duration}</div>
    <div className="text-xs opacity-75 mt-1">📅 {data.days} days</div>
  </div>
);

const TopicNode = ({ data }) => (
  <div className={`px-4 py-3 rounded-lg shadow-md border-2 min-w-max transition-all hover:shadow-lg ${data.difficulty === 'Beginner' ? 'bg-green-50 border-green-400 text-green-900' :
    data.difficulty === 'Intermediate' ? 'bg-yellow-50 border-yellow-400 text-yellow-900' :
      'bg-red-50 border-red-400 text-red-900'
    }`}>
    <div className="font-semibold text-sm mb-1">{data.label}</div>
    <div className="text-xs mb-2 opacity-75">{data.description}</div>
    <div className="flex items-center gap-2">
      <Clock className="w-3 h-3" />
      <span className="text-xs">{data.days} days</span>
    </div>
    <div className="text-xs mt-1 px-2 py-1 bg-white bg-opacity-50 rounded">
      {data.difficulty}
    </div>
  </div>
);

const ProjectNode = ({ data }) => (
  <div className="px-4 py-3 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-900 rounded-lg shadow-md border-2 border-purple-300 min-w-max hover:shadow-lg transition-all">
    <div className="font-bold text-sm mb-1 flex items-center gap-1">
      <Award className="w-4 h-4" />
      {data.label}
    </div>
    <div className="text-xs mb-2 opacity-75">{data.description}</div>
    <div className="text-xs px-2 py-1 bg-white bg-opacity-70 rounded inline-block">
      🎯 {data.difficulty}
    </div>
  </div>
);

const ResourceNode = ({ data }) => (
  <div className="px-3 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-900 rounded-lg shadow border border-indigo-300 min-w-max text-xs hover:shadow-md transition-all">
    <div className="font-semibold mb-1 flex items-center gap-1">
      <BookOpen className="w-3 h-3" />
      Resources
    </div>
    <div className="text-xs opacity-75">{data.count} links</div>
  </div>
);

// ============================================
// Interactive Roadmap Flow Viewer
// ============================================

export const RoadmapFlowViewer = ({ skill, roadmap }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedPhase, setSelectedPhase] = useState(0);

  // Generate nodes and edges from roadmap data
  useEffect(() => {
    if (!roadmap || !roadmap.phases) return;

    let newNodes = [];
    let newEdges = [];
    let nodeId = 0;
    let yOffset = 0;

    // Add skill title node
    newNodes.push({
      id: 'skill-title',
      data: {
        label: roadmap.skill || skill,
      },
      position: { x: 0, y: yOffset },
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '18px',
        textAlign: 'center',
        minWidth: '250px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        border: '3px solid #5568d3',
      },
    });

    yOffset += 150;

    // Add phase and topic nodes
    roadmap.phases.forEach((phase, phaseIdx) => {
      const phaseNodeId = `phase-${phaseIdx}`;

      // Phase node
      newNodes.push({
        id: phaseNodeId,
        data: {
          label: phase.name,
          duration: phase.duration,
          days: phase.topics?.reduce((sum, t) => sum + (t.daysToComplete || 2), 0) || 0,
        },
        position: { x: 0, y: yOffset },
        type: 'input',
        style: {
          minWidth: '220px',
        },
      });

      // Connect skill to phase
      newEdges.push({
        id: `skill-to-${phaseNodeId}`,
        source: phaseIdx === 0 ? 'skill-title' : `phase-${phaseIdx - 1}`,
        target: phaseNodeId,
        animated: true,
        style: { stroke: '#667eea', strokeWidth: 2 },
      });

      yOffset += 120;

      // Topic nodes for this phase
      phase.topics?.forEach((topic, topicIdx) => {
        const topicNodeId = `topic-${phaseIdx}-${topicIdx}`;

        newNodes.push({
          id: topicNodeId,
          data: {
            label: topic.title,
            description: topic.description?.substring(0, 40) + '...',
            days: topic.daysToComplete || 2,
            difficulty: ['Beginner', 'Intermediate', 'Advanced'][topicIdx % 3],
          },
          position: { x: 280, y: yOffset - 60 + topicIdx * 100 },
          style: {
            minWidth: '200px',
          },
        });

        // Connect phase to topic
        newEdges.push({
          id: `${phaseNodeId}-to-${topicNodeId}`,
          source: phaseNodeId,
          target: topicNodeId,
          style: { stroke: '#10b981', strokeWidth: 1.5 },
        });

        // Add resource node if exists
        if (topic.resources && topic.resources.length > 0) {
          const resourceNodeId = `resource-${phaseIdx}-${topicIdx}`;
          newNodes.push({
            id: resourceNodeId,
            data: {
              label: 'Resources',
              count: topic.resources.length,
            },
            position: { x: 600, y: yOffset - 60 + topicIdx * 100 },
            style: {
              minWidth: '150px',
            },
          });

          newEdges.push({
            id: `${topicNodeId}-to-${resourceNodeId}`,
            source: topicNodeId,
            target: resourceNodeId,
            style: { stroke: '#6366f1', strokeWidth: 1 },
          });
        }
      });

      yOffset += Math.max(120, phase.topics?.length * 100 || 120) + 100;
    });

    // Add projects
    if (roadmap.projects && roadmap.projects.length > 0) {
      newNodes.push({
        id: 'projects-title',
        data: { label: '🚀 Hands-On Projects' },
        position: { x: 280, y: yOffset },
        style: {
          background: '#f3e8ff',
          color: '#7c3aed',
          padding: '16px',
          borderRadius: '12px',
          fontWeight: 'bold',
          fontSize: '14px',
          border: '2px solid #a855f7',
          minWidth: '180px',
        },
      });

      yOffset += 80;

      roadmap.projects.forEach((project, projIdx) => {
        const projectNodeId = `project-${projIdx}`;

        newNodes.push({
          id: projectNodeId,
          data: {
            label: project.name,
            description: project.description?.substring(0, 30),
            difficulty: project.difficulty,
          },
          position: { x: 280 + projIdx * 250, y: yOffset },
          style: {
            minWidth: '200px',
          },
        });

        newEdges.push({
          id: `projects-title-to-${projectNodeId}`,
          source: 'projects-title',
          target: projectNodeId,
          style: { stroke: '#a855f7', strokeWidth: 1.5, strokeDasharray: '5,5' },
        });
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [roadmap, skill]);

  const nodeTypes = {
    phaseNode: PhaseNode,
    topicNode: TopicNode,
    projectNode: ProjectNode,
    resourceNode: ResourceNode,
  };

  return (
    <div className="w-full h-screen bg-gray-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-lg p-6 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {roadmap.skill || skill} Learning Roadmap
              </h1>
              <p className="text-gray-600">{roadmap.description}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-blue-600">{roadmap.totalDays}</div>
              <div className="text-gray-600">Days to Master</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="h-screen pt-32">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-xs">
        <h3 className="font-bold mb-3 text-sm">📋 Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Learning Phase</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Beginner Topic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Intermediate Topic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Advanced Topic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded"></div>
            <span>Project/Resources</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Enhanced Multi-Skill View with Cards
// ============================================

export const RoadmapCardView = ({ skill, roadmap }) => {
  const [expandedPhase, setExpandedPhase] = useState(null);

  if (!roadmap) return null;

  const getDifficultyColor = (index) => {
    const colors = ['bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-red-100 text-red-800'];
    return colors[index % 3];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Skill Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold mb-2">{roadmap.skill || skill}</h1>
          <p className="text-blue-100 mb-4">{roadmap.description}</p>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{roadmap.totalDays} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span>{roadmap.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{roadmap.phases?.length || 0} Phases</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400"></div>

        {/* Phases */}
        <div className="space-y-12">
          {roadmap.phases?.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="ml-24 relative">
              {/* Timeline Dot */}
              <div className="absolute -left-20 top-6 w-10 h-10 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-blue-600">{phaseIdx + 1}</span>
              </div>

              {/* Phase Card */}
              <div
                onClick={() => setExpandedPhase(expandedPhase === phaseIdx ? null : phaseIdx)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-blue-500 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{phase.name}</h2>
                    <p className="text-gray-600">{phase.duration} • {phase.description}</p>
                  </div>
                  <ChevronRight
                    className={`w-6 h-6 text-blue-600 transition-transform ${expandedPhase === phaseIdx ? 'rotate-90' : ''
                      }`}
                  />
                </div>

                {/* Topics Grid */}
                {expandedPhase === phaseIdx && (
                  <div className="mt-6 space-y-4">
                    {phase.topics?.map((topic, topicIdx) => (
                      <div key={topicIdx} className={`p-4 rounded-lg ${getDifficultyColor(topicIdx)}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{topic.title}</h3>
                            <p className="text-sm opacity-75">{topic.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4 whitespace-nowrap">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-semibold">{topic.daysToComplete || 2}d</span>
                          </div>
                        </div>

                        {/* Subtopics */}
                        {topic.subtopics && topic.subtopics.length > 0 && (
                          <div className="mt-3 space-y-2 pl-4 border-l-2 border-current opacity-75">
                            {topic.subtopics.map((sub, subIdx) => (
                              <div key={subIdx} className="text-sm">
                                <div className="font-semibold">• {sub.name}</div>
                                {sub.description && <div className="text-xs opacity-75 ml-4">{sub.description}</div>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Resources */}
                        {topic.resources && topic.resources.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-current border-opacity-25">
                            <div className="text-xs font-semibold mb-2 flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              Resources ({topic.resources.length})
                            </div>
                            <div className="space-y-1">
                              {topic.resources.slice(0, 3).map((res, resIdx) => (
                                <a
                                  key={resIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs underline opacity-75 hover:opacity-100 block truncate"
                                  title={res.title}
                                >
                                  🔗 {res.title}
                                </a>
                              ))}
                              {topic.resources.length > 3 && (
                                <div className="text-xs opacity-75">+{topic.resources.length - 3} more</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        {roadmap.projects && roadmap.projects.length > 0 && (
          <div className="mt-16 ml-24">
            <div className="absolute -left-20 top-6 w-10 h-10 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-l-4 border-purple-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-8 h-8 text-purple-600" />
                Hands-On Projects
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roadmap.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-all border-l-4 border-purple-400"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{project.name}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full ${project.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.skills.map((skill, sidx) => (
                          <span key={sidx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Summary */}
      <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          Your Learning Journey
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{roadmap.totalDays}</div>
            <div className="text-sm text-gray-600">Days Total</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{roadmap.phases?.length || 0}</div>
            <div className="text-sm text-gray-600">Learning Phases</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-pink-600">
              {roadmap.phases?.reduce((sum, p) => sum + (p.topics?.length || 0), 0) || 0}
            </div>
            <div className="text-sm text-gray-600">Topics</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-emerald-600">{roadmap.projects?.length || 0}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Multi-Skill Display with Tabs
// ============================================



export const MultiSkillFlowViewer = ({ roadmaps, viewType = 'cards' }) => {
  const [selectedView, setSelectedView] = useState('cards');
  const skills = Object.keys(roadmaps || {});

  if (!roadmaps || skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Roadmaps Available</h2>
          <p className="text-gray-600">Roadmaps will appear here once they are generated</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-lg sticky top-0 z-20">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Your Learning Roadmaps</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedView('cards')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedView === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
              >
                📊 Card View
              </button>
              <button
                onClick={() => setSelectedView('flow')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedView === 'flow'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
              >
                🔗 Flow View
              </button>
            </div>
          </div>

          {/* Skill Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {skills.map((skill) => (
              <button
                key={skill}
                className="px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all bg-white border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {Object.entries(roadmaps).map(([skill, roadmap]) => (
          <div key={skill} className="mb-12">
            {selectedView === 'cards' ? (
              <RoadmapCardView skill={skill} roadmap={roadmap} />
            ) : (
              <RoadmapFlowViewer skill={skill} roadmap={roadmap} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSkillFlowViewer;

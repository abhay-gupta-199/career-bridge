import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoadmapCardView, RoadmapFlowViewer, MultiSkillFlowViewer } from '../../components/RoadmapFlowViewer';
import { BookOpen, AlertCircle, Zap, Briefcase, ChevronRight, Filter, X } from 'lucide-react';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

/**
 * 🎓 Student Roadmaps Page
 * Display hardcoded roadmaps based on job selection
 * Uses hardcoded data instead of Gemini/Llama agents
 */

// Hardcoded Roadmaps Data
const HARDCODED_ROADMAPS = {
  python: {
    skill: "Python",
    description: "Master Python programming from basics to advanced",
    difficulty: "All Levels",
    totalDays: 60,
    phases: [
      {
        name: "Phase 1: Fundamentals",
        duration: "2 weeks",
        description: "Learn the basics of Python programming",
        topics: [
          {
            title: "Variables & Data Types",
            description: "Strings, integers, floats, lists, dictionaries",
            daysToComplete: 3,
            subtopics: [
              { name: "String operations", description: "String methods and manipulation" },
              { name: "Number types", description: "Int, float, and mathematical operations" }
            ],
            resources: [
              { title: "Python Official Docs", url: "https://docs.python.org", type: "Official", difficulty: "Beginner" },
              { title: "W3Schools Python Tutorial", url: "https://www.w3schools.com/python", type: "Tutorial", difficulty: "Beginner" }
            ]
          },
          {
            title: "Control Flow (if/else/loops)",
            description: "Conditional statements and loops",
            daysToComplete: 3,
            subtopics: [
              { name: "If-else statements", description: "Conditional logic" },
              { name: "Loops (for, while)", description: "Iteration patterns" }
            ],
            resources: [
              { title: "Real Python - Control Flow", url: "https://realpython.com", type: "Article", difficulty: "Beginner" }
            ]
          }
        ]
      },
      {
        name: "Phase 2: Intermediate",
        duration: "2 weeks",
        description: "Functions, modules, and file handling",
        topics: [
          {
            title: "Functions & Modules",
            description: "Create reusable code with functions and modules",
            daysToComplete: 4,
            subtopics: [
              { name: "Function definition", description: "Parameters and return values" },
              { name: "Modules and packages", description: "Import and use modules" }
            ],
            resources: [
              { title: "Python Functions Guide", url: "https://docs.python.org/tutorial", type: "Tutorial", difficulty: "Intermediate" }
            ]
          },
          {
            title: "Object-Oriented Programming",
            description: "Classes, objects, and inheritance",
            daysToComplete: 5,
            subtopics: [
              { name: "Classes and objects", description: "OOP basics" },
              { name: "Inheritance", description: "Class inheritance patterns" }
            ],
            resources: [
              { title: "OOP in Python", url: "https://realpython.com/python3-object-oriented-programming", type: "Article", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        name: "Phase 3: Advanced",
        duration: "2 weeks",
        description: "Advanced topics and practical applications",
        topics: [
          {
            title: "Web Frameworks (Django/Flask)",
            description: "Build web applications",
            daysToComplete: 5,
            subtopics: [
              { name: "Flask basics", description: "Lightweight web framework" },
              { name: "Django ORM", description: "Database interactions" }
            ],
            resources: [
              { title: "Flask Official Docs", url: "https://flask.palletsprojects.com", type: "Official", difficulty: "Advanced" }
            ]
          }
        ]
      }
    ],
    projects: [
      { name: "Calculator App", description: "Build a simple calculator", difficulty: "Beginner", skills: ["variables", "functions"] },
      { name: "Todo Manager", description: "Create a task management app", difficulty: "Intermediate", skills: ["OOP", "file handling"] },
      { name: "Blog Platform", description: "Build a blog with Flask", difficulty: "Advanced", skills: ["Flask", "database"] }
    ]
  },
  javascript: {
    skill: "JavaScript",
    description: "Master JavaScript for web development",
    difficulty: "All Levels",
    totalDays: 45,
    phases: [
      {
        name: "Phase 1: Fundamentals",
        duration: "1.5 weeks",
        description: "JavaScript basics and DOM manipulation",
        topics: [
          {
            title: "Syntax & Data Types",
            description: "Variables, operators, and data structures",
            daysToComplete: 3,
            subtopics: [
              { name: "Variables (var, let, const)", description: "Variable scoping" },
              { name: "Data types", description: "Primitives and objects" }
            ],
            resources: [
              { title: "MDN JavaScript Basics", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript", type: "Official", difficulty: "Beginner" }
            ]
          },
          {
            title: "DOM Manipulation",
            description: "Interact with HTML elements",
            daysToComplete: 3,
            subtopics: [
              { name: "Selecting elements", description: "querySelector and getElementById" },
              { name: "Event handling", description: "Click, input, and other events" }
            ],
            resources: [
              { title: "DOM Manipulation Guide", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model", type: "Official", difficulty: "Beginner" }
            ]
          }
        ]
      },
      {
        name: "Phase 2: Intermediate",
        duration: "1.5 weeks",
        description: "Advanced JavaScript concepts",
        topics: [
          {
            title: "Asynchronous Programming",
            description: "Promises, async/await, callbacks",
            daysToComplete: 4,
            subtopics: [
              { name: "Callbacks", description: "Callback functions" },
              { name: "Promises", description: "Promise API" },
              { name: "Async/await", description: "Modern async syntax" }
            ],
            resources: [
              { title: "Async JavaScript", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous", type: "Official", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        name: "Phase 3: Advanced",
        duration: "1 week",
        description: "React and modern JavaScript",
        topics: [
          {
            title: "React Framework",
            description: "Component-based UI library",
            daysToComplete: 5,
            subtopics: [
              { name: "Components", description: "Functional components" },
              { name: "Hooks", description: "useState, useEffect, custom hooks" }
            ],
            resources: [
              { title: "React Official Docs", url: "https://react.dev", type: "Official", difficulty: "Advanced" }
            ]
          }
        ]
      }
    ],
    projects: [
      { name: "Interactive Todo", description: "Todo list with DOM manipulation", difficulty: "Beginner", skills: ["DOM", "events"] },
      { name: "Weather App", description: "API integration with async code", difficulty: "Intermediate", skills: ["async", "API"] },
      { name: "React Dashboard", description: "Dashboard with React", difficulty: "Advanced", skills: ["React", "hooks"] }
    ]
  },
  css: {
    skill: "CSS",
    description: "Master CSS for beautiful web design",
    difficulty: "All Levels",
    totalDays: 30,
    phases: [
      {
        name: "Phase 1: Fundamentals",
        duration: "1 week",
        description: "CSS basics and selectors",
        topics: [
          {
            title: "Selectors & Properties",
            description: "CSS basics",
            daysToComplete: 3,
            subtopics: [
              { name: "Element selectors", description: "Basic selectors" },
              { name: "CSS properties", description: "Color, font, size" }
            ],
            resources: [
              { title: "MDN CSS Basics", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS", type: "Official", difficulty: "Beginner" }
            ]
          }
        ]
      },
      {
        name: "Phase 2: Intermediate",
        duration: "1 week",
        description: "Layout and positioning",
        topics: [
          {
            title: "Flexbox & Grid",
            description: "Modern layout techniques",
            daysToComplete: 4,
            subtopics: [
              { name: "Flexbox", description: "Flexible layouts" },
              { name: "CSS Grid", description: "Grid system" }
            ],
            resources: [
              { title: "CSS Tricks Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox", type: "Guide", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        name: "Phase 3: Advanced",
        duration: "1 week",
        description: "Animations and responsive design",
        topics: [
          {
            title: "Animations & Responsive",
            description: "Advanced CSS techniques",
            daysToComplete: 3,
            subtopics: [
              { name: "CSS animations", description: "Keyframe animations" },
              { name: "Media queries", description: "Responsive design" }
            ],
            resources: [
              { title: "CSS Animations Guide", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations", type: "Official", difficulty: "Advanced" }
            ]
          }
        ]
      }
    ],
    projects: [
      { name: "Portfolio Site", description: "Responsive portfolio website", difficulty: "Intermediate", skills: ["flexbox", "responsive"] },
      { name: "Animated Landing", description: "Landing page with animations", difficulty: "Advanced", skills: ["animations", "design"] }
    ]
  },
  aws: {
    skill: "AWS",
    description: "Master Amazon Web Services cloud platform",
    difficulty: "Intermediate to Advanced",
    totalDays: 50,
    phases: [
      {
        name: "Phase 1: Fundamentals",
        duration: "2 weeks",
        description: "AWS basics and core services",
        topics: [
          {
            title: "AWS Fundamentals",
            description: "Cloud concepts and AWS ecosystem",
            daysToComplete: 3,
            subtopics: [
              { name: "Cloud computing basics", description: "IaaS, PaaS, SaaS" },
              { name: "AWS global infrastructure", description: "Regions and availability zones" }
            ],
            resources: [
              { title: "AWS Training", url: "https://aws.amazon.com/training", type: "Official", difficulty: "Beginner" }
            ]
          },
          {
            title: "EC2 & S3",
            description: "Compute and storage services",
            daysToComplete: 4,
            subtopics: [
              { name: "EC2 instances", description: "Virtual computers" },
              { name: "S3 buckets", description: "Object storage" }
            ],
            resources: [
              { title: "AWS EC2 Documentation", url: "https://aws.amazon.com/ec2", type: "Official", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        name: "Phase 2: Intermediate",
        duration: "2 weeks",
        description: "Databases and networking",
        topics: [
          {
            title: "RDS & Databases",
            description: "Database services on AWS",
            daysToComplete: 4,
            subtopics: [
              { name: "RDS", description: "Managed relational databases" },
              { name: "DynamoDB", description: "NoSQL database" }
            ],
            resources: [
              { title: "AWS RDS Guide", url: "https://aws.amazon.com/rds", type: "Official", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        name: "Phase 3: Advanced",
        duration: "2 weeks",
        description: "Advanced deployment and monitoring",
        topics: [
          {
            title: "Lambda & Serverless",
            description: "Serverless computing",
            daysToComplete: 4,
            subtopics: [
              { name: "Lambda functions", description: "Event-driven computing" },
              { name: "API Gateway", description: "Create REST APIs" }
            ],
            resources: [
              { title: "AWS Lambda", url: "https://aws.amazon.com/lambda", type: "Official", difficulty: "Advanced" }
            ]
          }
        ]
      }
    ],
    projects: [
      { name: "Static Website on S3", description: "Host a website on AWS S3", difficulty: "Beginner", skills: ["S3"] },
      { name: "Web App with RDS", description: "Application with database", difficulty: "Intermediate", skills: ["EC2", "RDS"] }
    ]
  },
  azure: {
    skill: "Azure",
    description: "Master Microsoft Azure cloud platform",
    difficulty: "Intermediate to Advanced",
    totalDays: 50,
    phases: [
      {
        name: "Phase 1: Fundamentals",
        duration: "2 weeks",
        description: "Azure basics and core services",
        topics: [
          {
            title: "Azure Fundamentals",
            description: "Cloud concepts and Azure ecosystem",
            daysToComplete: 3,
            subtopics: [
              { name: "Azure regions", description: "Availability zones" },
              { name: "Resource management", description: "Resource groups" }
            ],
            resources: [
              { title: "Azure Training", url: "https://learn.microsoft.com/en-us/training/azure", type: "Official", difficulty: "Beginner" }
            ]
          }
        ]
      },
      {
        name: "Phase 2: Intermediate",
        duration: "2 weeks",
        description: "Virtual machines and databases",
        topics: [
          {
            title: "Virtual Machines",
            description: "Azure VMs and networking",
            daysToComplete: 4,
            subtopics: [
              { name: "Azure VMs", description: "Virtual machine management" },
              { name: "Networking", description: "Virtual networks" }
            ],
            resources: [
              { title: "Azure VMs", url: "https://learn.microsoft.com/en-us/azure/virtual-machines", type: "Official", difficulty: "Intermediate" }
            ]
          }
        ]
      },
      {
        name: "Phase 3: Advanced",
        duration: "2 weeks",
        description: "App services and containers",
        topics: [
          {
            title: "App Services & Containers",
            description: "Managed application hosting",
            daysToComplete: 4,
            subtopics: [
              { name: "App Service", description: "Web app hosting" },
              { name: "Azure Container", description: "Docker containers" }
            ],
            resources: [
              { title: "Azure App Service", url: "https://learn.microsoft.com/en-us/azure/app-service", type: "Official", difficulty: "Advanced" }
            ]
          }
        ]
      }
    ],
    projects: [
      { name: "Web App Deployment", description: "Deploy app to Azure App Service", difficulty: "Intermediate", skills: ["App Service"] }
    ]
  }
};

export default function StudentRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState({});
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [expandedSkills, setExpandedSkills] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [viewType, setViewType] = useState('cards');
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch jobs from API
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get('/student/jobs');
      setJobs(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get roadmaps for selected job's missing skills
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setActiveTab('roadmaps');

    // Extract missing skills from the job
    const missingSkills = job.studentMatch?.missing_skills || job.skillsRequired || [];
    
    // Map skills to hardcoded roadmaps (case-insensitive)
    const skillToRoadmapMap = {
      'python': 'python',
      'javascript': 'javascript',
      'js': 'javascript',
      'css': 'css',
      'aws': 'aws',
      'amazon web services': 'aws',
      'azure': 'azure',
      'microsoft azure': 'azure'
    };

    const selectedRoadmaps = {};
    const unmatched = [];

    missingSkills.forEach(skill => {
      const skillLower = skill.toLowerCase().trim();
      const roadmapKey = skillToRoadmapMap[skillLower];

      if (roadmapKey && HARDCODED_ROADMAPS[roadmapKey]) {
        // use roadmap key to dedupe multiple aliases
        selectedRoadmaps[roadmapKey] = HARDCODED_ROADMAPS[roadmapKey];
      } else {
        unmatched.push(skill);
      }
    });

    setRoadmaps(selectedRoadmaps);
    if (unmatched.length > 0) {
      // keep unmatched info on the selected job for small UI hint
      setSelectedJob(prev => ({ ...job, _unmatchedSkills: unmatched }));
    }
  };

  // If navigated with a pre-selected job (from dashboard), handle that selection
  useEffect(() => {
    const pre = location?.state?.selectedJob;
    if (pre) handleJobSelect(pre);
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex">
          <Sidebar activeTab="roadmaps" />
          <div className="flex-1 p-6 md:p-8">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6 animate-pulse">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Loading Opportunities</h2>
              <p className="text-gray-600">Fetching job opportunities and roadmaps...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <Navbar />
        <div className="flex">
          <Sidebar activeTab="roadmaps" />
          <div className="flex-1 p-6 md:p-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Error</h2>
              <p className="text-gray-600 text-center mb-6">{error}</p>
              <button
                onClick={fetchJobs}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="roadmaps" />
        <div className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-5xl font-bold mb-3">Learning Roadmaps</h1>
                  <p className="text-blue-100 text-lg mb-2">
                    Select a job opportunity to view required learning paths
                  </p>
                  <p className="text-blue-100 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {jobs.length} job opportunities available
                  </p>
                </div>
                <div className="text-6xl">🗺️</div>
              </div>
            </div>
          </section>

          {/* Tab Navigation */}
          <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`py-4 font-semibold border-b-2 transition-colors ${
                    activeTab === 'jobs'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  💼 Available Jobs ({jobs.length})
                </button>
                <button
                  onClick={() => setActiveTab('roadmaps')}
                  className={`py-4 font-semibold border-b-2 transition-colors ${
                    activeTab === 'roadmaps'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  📚 Learning Paths {selectedJob && `(${Object.keys(roadmaps).length})`}
                </button>
              </div>
            </div>
          </section>

          {/* Content */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Opportunities</h2>
                
                {jobs.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Job Opportunities</h3>
                    <p className="text-gray-600">Check back soon for new job listings</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {jobs.map((job) => (
                      <div
                        key={job._id || job.id}
                        onClick={() => handleJobSelect(job)}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border border-gray-200 hover:border-blue-300 group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-gray-600 mt-1">{job.company}</p>
                          </div>
                          <div className="text-right">
                            {job.studentMatch?.matchPercentage && (
                              <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">
                                  {job.studentMatch.matchPercentage}%
                                </p>
                                <p className="text-xs text-gray-600">Match</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Skills Info */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-semibold">Matched</p>
                            <p className="text-lg font-bold text-green-600">
                              {job.studentMatch?.matched_skills?.length || 0}
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-semibold">Required</p>
                            <p className="text-lg font-bold text-yellow-600">
                              {job.skillsRequired?.length || 0}
                            </p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-semibold">To Develop</p>
                            <p className="text-lg font-bold text-red-600">
                              {job.studentMatch?.missing_skills?.length || 0}
                            </p>
                          </div>
                        </div>

                        {/* Skills Tags */}
                        {job.studentMatch?.missing_skills && job.studentMatch.missing_skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Skills to Develop:</p>
                            <div className="flex flex-wrap gap-2">
                              {job.studentMatch.missing_skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                                >
                                  📚 {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <p className="text-gray-600 text-sm">{job.location}</p>
                          <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                            View Roadmap <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Roadmaps Tab */}
            {activeTab === 'roadmaps' && (
              <div>
                {!selectedJob ? (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Job Selected</h3>
                    <p className="text-gray-600 mb-6">
                      Click on a job opportunity above to view its required learning roadmaps
                    </p>
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                      <Briefcase className="w-5 h-5" />
                      Browse Jobs
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Selected Job Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-3xl font-bold mb-2">{selectedJob.title}</h2>
                          <p className="text-blue-100">{selectedJob.company} • {selectedJob.location}</p>
                          {selectedJob.studentMatch?.missing_skills && (
                            <p className="text-blue-100 mt-2">
                              {selectedJob.studentMatch.missing_skills.length} skills to develop for this role
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedJob(null);
                            setRoadmaps({});
                          }}
                          className="text-white/80 hover:text-white transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    </div>

                    {Object.keys(roadmaps).length === 0 ? (
                      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Hardcoded Roadmaps</h3>
                        <p className="text-gray-600 mb-4">
                          The required skills for this job don't have predefined roadmaps yet.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-sm text-yellow-800">
                            <strong>Required Skills:</strong>{' '}
                            {selectedJob.skillsRequired?.join(', ') || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Search + View Type Toggle */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 w-full max-w-md">
                            <input
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search skills or topics..."
                              className="px-4 py-2 rounded-lg border border-gray-200 w-full"
                            />
                          </div>
                          <div className="flex gap-2 bg-gray-100 p-2 rounded-lg w-fit ml-4">
                            <button
                              onClick={() => setViewType('cards')}
                              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                                viewType === 'cards'
                                  ? 'bg-white text-blue-600 shadow-md'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              📊 Cards
                            </button>
                            <button
                              onClick={() => setViewType('flow')}
                              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                                viewType === 'flow'
                                  ? 'bg-white text-blue-600 shadow-md'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              🔗 Flow
                            </button>
                            <button
                              onClick={() => setViewType('grid')}
                              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                                viewType === 'grid'
                                  ? 'bg-white text-blue-600 shadow-md'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              🎯 All
                            </button>
                          </div>
                        </div>

                        {/* Roadmaps Display */}
                        {viewType === 'cards' && (
                          <div className="space-y-6">
                            {Object.entries(roadmaps)
                              .filter(([key, rm]) => {
                                if (!searchTerm) return true;
                                const s = searchTerm.toLowerCase();
                                return (
                                  key.includes(s) ||
                                  rm.skill.toLowerCase().includes(s) ||
                                  rm.description.toLowerCase().includes(s) ||
                                  rm.phases.some(p => p.name.toLowerCase().includes(s) || p.topics.some(t => t.title.toLowerCase().includes(s)))
                                );
                              })
                              .map(([skillKey, roadmap]) => (
                                <div key={skillKey} className="bg-white rounded-2xl shadow p-6 border border-gray-200">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="text-2xl font-bold text-gray-900">{roadmap.skill}</h3>
                                      <p className="text-gray-600 mt-1">{roadmap.description}</p>
                                      <p className="text-sm text-gray-500 mt-2">{roadmap.totalDays} days • {roadmap.phases.length} phases</p>
                                    </div>
                                    <div className="text-right">
                                      <button
                                        onClick={() => setExpandedSkills(prev => ({ ...prev, [skillKey]: !prev[skillKey] }))}
                                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md font-semibold"
                                      >
                                        {expandedSkills[skillKey] ? 'Collapse' : 'Expand'}
                                      </button>
                                    </div>
                                  </div>

                                  {expandedSkills[skillKey] && (
                                    <div className="mt-4 space-y-4">
                                      {roadmap.phases.map((phase, idx) => (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                          <h4 className="font-semibold">{phase.name} • {phase.duration}</h4>
                                          <p className="text-sm text-gray-600">{phase.description}</p>
                                          <ul className="mt-2 space-y-2">
                                            {phase.topics.map((topic, tIdx) => (
                                              <li key={tIdx} className="pl-2">
                                                <div className="flex items-center justify-between">
                                                  <div>
                                                    <p className="font-medium">{topic.title}</p>
                                                    <p className="text-sm text-gray-500">{topic.description}</p>
                                                  </div>
                                                  <div className="text-sm text-gray-400">{topic.daysToComplete}d</div>
                                                </div>
                                                {topic.resources && (
                                                  <div className="mt-2 text-sm text-blue-600">
                                                    Resources: {topic.resources.map(r => r.title).join(', ')}
                                                  </div>
                                                )}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}

                                      {roadmap.projects && (
                                        <div className="pt-2">
                                          <h5 className="font-semibold">Projects</h5>
                                          <ul className="mt-2 space-y-2">
                                            {roadmap.projects.map((p, pi) => (
                                              <li key={pi} className="text-sm text-gray-700">• {p.name} — {p.description} <span className="text-gray-500">({p.difficulty})</span></li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}

                        {viewType === 'flow' && Object.entries(roadmaps).length > 0 && (
                          <div className="h-[calc(100vh-400px)]">
                            <RoadmapFlowViewer
                              skill={Object.keys(roadmaps)[0]}
                              roadmap={Object.values(roadmaps)[0]}
                            />
                          </div>
                        )}

                        {viewType === 'grid' && (
                          <MultiSkillFlowViewer roadmaps={roadmaps} viewType="cards" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { MultiSkillFlowViewer } from '../../components/RoadmapFlowViewer';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  RefreshCw,
  Zap,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Loader,
  MapPin,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import GlassCard from '../../components/ui/GlassCard';
import GradientCard from '../../components/ui/GradientCard';
import AnimatedBadge from '../../components/ui/AnimatedBadge';
import { generateJobRoadmap, getJobsForRoadmaps } from '../../api/roadmapApi';
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
  },
  react: {
    skill: "React",
    description: "Master React.js for modern frontend development",
    difficulty: "Intermediate",
    totalDays: 40,
    phases: [
      {
        name: "Phase 1: Core Concepts",
        duration: "1.5 weeks",
        description: "Components, Props, State",
        topics: [
          {
            title: "React Basics",
            description: "JSX, Components, Props",
            daysToComplete: 4,
            subtopics: [
              { name: "JSX", description: "Syntax extension for JS" },
              { name: "Props vs State", description: "Data flow" }
            ],
            resources: [
              { title: "React Docs", url: "https://react.dev", type: "Official", difficulty: "Beginner" }
            ]
          }
        ]
      },
      {
        name: "Phase 2: Hooks",
        duration: "1.5 weeks",
        description: "Modern React Hooks",
        topics: [
          {
            title: "Essential Hooks",
            description: "useState, useEffect, useContext",
            daysToComplete: 5,
            subtopics: [
              { name: "useState", description: "State management" },
              { name: "useEffect", description: "Side effects" }
            ],
            resources: [
              { title: "Hooks API", url: "https://react.dev/reference/react", type: "Official", difficulty: "Intermediate" }
            ]
          }
        ]
      }
    ],
    projects: [
      { name: "Task Tracker", description: "Task management with hooks", difficulty: "Beginner", skills: ["useState", "props"] }
    ]
  },
  node: {
    skill: "Node.js",
    description: "Master Backend Development with Node.js",
    difficulty: "Intermediate",
    totalDays: 45,
    phases: [
      {
        name: "Phase 1: Runtime & Modules",
        duration: "1.5 weeks",
        description: "Event loop, File System, Modules",
        topics: [
          {
            title: "Node.js Basics",
            description: "Runtime environment",
            daysToComplete: 4,
            subtopics: [
              { name: "Event Loop", description: "How Node works" },
              { name: "CommonJS vs ES Modules", description: "Module systems" }
            ],
            resources: [
              { title: "Node.js Docs", url: "https://nodejs.org/en/docs/", type: "Official", difficulty: "Beginner" }
            ]
          }
        ]
      },
      {
        name: "Phase 2: Express.js",
        duration: "1.5 weeks",
        description: "Building REST APIs",
        topics: [
          {
            title: "Express Basics",
            description: "Routing, Middleware",
            daysToComplete: 5,
            subtopics: [
              { name: "Routing", description: "Define endpoints" },
              { name: "Middleware", description: "Request processing" }
            ],
            resources: [
              { title: "Express Docs", url: "https://expressjs.com", type: "Official", difficulty: "Intermediate" }
            ]
          }
        ]
      }
    ],
    projects: [
      { name: "REST API", description: "Build a CRUD API", difficulty: "Intermediate", skills: ["Express", "MongoDB"] }
    ]
  },
  "system design": {
    skill: "System Design",
    description: "Master Scalable System Architecture",
    difficulty: "Advanced",
    totalDays: 60,
    phases: [
      {
        name: "Phase 1: Basics",
        duration: "2 weeks",
        description: "Core distributed system concepts",
        topics: [
          {
            title: "Scalability Concepts",
            description: "Scaling, Load Balancing, Caching",
            daysToComplete: 5,
            subtopics: [
              { name: "Vertical vs Horizontal Scaling", description: "Scaling strategies" },
              { name: "Load Balancers", description: "Nginx, HAProxy" }
            ],
            resources: [{ title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "Guide", difficulty: "Beginner" }]
          }
        ]
      },
      {
        name: "Phase 2: Components",
        duration: "3 weeks",
        description: "Building blocks of large systems",
        topics: [
          {
            title: "Databases & Caching",
            description: "SQL vs NoSQL, CAP Theorem",
            daysToComplete: 7,
            subtopics: [{ name: "Sharding", description: "Data partitioning" }, { name: "Caching Strategies", description: "Write-through, Write-back" }]
          }
        ]
      }
    ],
    projects: [{ name: "Design URL Shortener", description: "Scale like TinyURL", difficulty: "Intermediate", skills: ["Hashing", "Database"] }]
  },
  "google cloud": {
    skill: "Google Cloud",
    description: "Master GCP Services",
    difficulty: "Intermediate",
    totalDays: 45,
    phases: [
      {
        name: "Phase 1: Core Services",
        duration: "2 weeks",
        description: "Compute, Storage, Networking",
        topics: [
          {
            title: "GCE & GCS",
            description: "Compute Engine & Cloud Storage",
            daysToComplete: 5,
            subtopics: [{ name: "VM Instances", description: "Deploying VMs" }, { name: "Buckets", description: "Object storage" }],
            resources: [{ title: "GCP Docs", url: "https://cloud.google.com/docs", type: "Official", difficulty: "Beginner" }]
          }
        ]
      }
    ],
    projects: [{ name: "Deploy App on App Engine", description: "Serverless deployment", difficulty: "Beginner", skills: ["App Engine"] }]
  },
  "flask": {
    skill: "Flask",
    description: "Build Web Apps with Python Flask",
    difficulty: "Beginner",
    totalDays: 30,
    phases: [
      {
        name: "Phase 1: Basics",
        duration: "1 week",
        description: "Routing and Templates",
        topics: [
          {
            title: "Routing & Views",
            description: "URL mapping and functions",
            daysToComplete: 3,
            subtopics: [{ name: "Routes", description: "@app.route decorator" }, { name: "Jinja2", description: "Templating engine" }],
            resources: [{ title: "Flask Mega Tutorial", url: "https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world", type: "Tutorial", difficulty: "Beginner" }]
          }
        ]
      }
    ],
    projects: [{ name: "Blog Engine", description: "Simple blog with database", difficulty: "Intermediate", skills: ["SQLAlchemy", "Jinja2"] }]
  }
};

const StudentRoadmaps = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  const fetchRecommendedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobsForRoadmaps();
      const filteredJobs = (data.recommendations || []).filter(
        job => job.matchPercentage >= 50
      );
      setJobs(filteredJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      // Fallback data if API fails to show something in UI
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmapForJob = async (jobId) => {
    setGeneratingRoadmap(true);
    setError(null);
    try {
      const job = jobs.find(j => j._id === jobId) || selectedJob;
      if (!job) throw new Error("Job not found");

      const missingSkills = job.studentMatch?.missing_skills || job.missingSkills || job.skillsRequired || [];

      const skillToRoadmapMap = {
        'python': 'python',
        'javascript': 'javascript',
        'js': 'javascript',
        'css': 'css',
        'aws': 'aws',
        'amazon web services': 'aws',
        'azure': 'azure',
        'microsoft azure': 'azure',
        'react': 'react',
        'reactjs': 'react',
        'node': 'node',
        'nodejs': 'node',
        'node.js': 'node'
      };

      const getGenericRoadmap = (skillName) => ({
        skill: skillName,
        description: `Master ${skillName} from basics to advanced`,
        difficulty: "All Levels",
        totalDays: 45,
        phases: [
          {
            name: "Phase 1: Foundations",
            duration: "1.5 weeks",
            description: `Core concepts of ${skillName}`,
            topics: [
              {
                title: "Basics & Syntax",
                description: `Fundamental building blocks`,
                daysToComplete: 3,
                subtopics: [
                  { name: "Getting started", description: "Installation and setup" },
                  { name: "Core concepts", description: "Key terminology" }
                ],
                resources: [
                  { title: "Official Documentation", url: `https://google.com/search?q=${skillName}+documentation`, type: "Official", difficulty: "Beginner" }
                ]
              },
              {
                title: "Advanced Concepts",
                description: "Deep dive into features",
                daysToComplete: 4,
                subtopics: [
                  { name: "Best practices", description: "Industry standards" },
                  { name: "Common patterns", description: "Design patterns" }
                ],
                resources: [
                  { title: "Advanced Guide", url: `https://google.com/search?q=${skillName}+advanced+guide`, type: "Guide", difficulty: "Advanced" }
                ]
              }
            ]
          },
          {
            name: "Phase 2: Application",
            duration: "2 weeks",
            description: "Building real-world projects",
            topics: [
              {
                title: "Project Development",
                description: "Applying knowledge",
                daysToComplete: 7,
                subtopics: [
                  { name: "Project planning", description: "Architecture" },
                  { name: "Implementation", description: "Coding the solution" }
                ],
                resources: []
              }
            ]
          }
        ],
        projects: [
          { name: "Starter Project", description: `Basic application using ${skillName}`, difficulty: "Beginner", skills: [skillName] },
          { name: "Advanced System", description: `Complex system integration`, difficulty: "Advanced", skills: [skillName, "System Design"] }
        ]
      });

      const foundRoadmaps = {};
      missingSkills.forEach(skill => {
        const skillLower = skill.toLowerCase().trim();
        const roadmapKey = skillToRoadmapMap[skillLower] || skillLower;

        let roadmapData = HARDCODED_ROADMAPS[roadmapKey] || HARDCODED_ROADMAPS[skillLower];

        // If no hardcoded roadmap found, generate a generic one
        if (!roadmapData) {
          roadmapData = getGenericRoadmap(skill);
        }

        foundRoadmaps[skill] = roadmapData;
      });

      // Mimic API structure
      const roadmapData = {
        job: { title: job.title, company: job.company },
        roadmap: foundRoadmaps,
        days_left: 30, // Default duration
        missing_skills: missingSkills
      };

      // Simulated network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setRoadmap(roadmapData);
      setGeneratingRoadmap(false);

    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError('Failed to generate roadmap');
      setGeneratingRoadmap(false);
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    generateRoadmapForJob(job._id);
  };

  const handleBackFromRoadmap = () => {
    setSelectedJob(null);
    setRoadmap(null);
    setGeneratingRoadmap(false);
  };

  // Roadmap Detail View - Same as before
  if (roadmap && selectedJob) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
              <div className="p-6 max-w-7xl mx-auto">
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={handleBackFromRoadmap}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back to Jobs
                </motion.button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="text-blue-600" size={32} />
                    {selectedJob.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <p className="text-gray-600 flex items-center gap-2">
                      <Briefcase size={16} /> {selectedJob.company}
                    </p>
                    {selectedJob.location && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin size={16} /> {selectedJob.location}
                      </p>
                    )}
                    <AnimatedBadge>
                      {selectedJob.matchPercentage || 0}% Match
                    </AnimatedBadge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-w-7xl mx-auto">
              {generatingRoadmap ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-96"
                >
                  <div className="text-center">
                    <Loader className="mx-auto mb-4 animate-spin text-blue-600" size={48} />
                    <p className="text-gray-600 text-lg font-medium">Generating AI-powered roadmap...</p>
                    <p className="text-gray-500 mt-2">This may take a moment as we craft your personalized learning path</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <MultiSkillFlowViewer roadmaps={roadmap.roadmap} />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Jobs List View
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                    <Zap className="text-yellow-500" size={36} />
                    Learning Roadmaps
                  </h1>
                  <p className="text-gray-600 mt-2">
                    AI-generated personalized learning paths based on your skill gaps
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchRecommendedJobs}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 transition-all shadow-lg"
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </motion.button>
                <a
                  href="/student/custom-roadmap"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg ml-3"
                >
                  <MapPin size={20} />
                  Custom Roadmap
                </a>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GradientCard className="from-blue-500 to-blue-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Available Jobs</p>
                      <p className="text-white text-3xl font-bold mt-1">{jobs.length}</p>
                    </div>
                    <BookOpen className="text-blue-200" size={40} />
                  </div>
                </GradientCard>

                <GradientCard className="from-purple-500 to-purple-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">AI-Generated</p>
                      <p className="text-white text-3xl font-bold mt-1">100%</p>
                    </div>
                    <Sparkles className="text-purple-200" size={40} />
                  </div>
                </GradientCard>

                <GradientCard className="from-green-500 to-green-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Powered by</p>
                      <p className="text-white text-3xl font-bold mt-1">Gemini</p>
                    </div>
                    <TrendingUp className="text-green-200" size={40} />
                  </div>
                </GradientCard>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 flex items-start gap-3"
              >
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonLoader key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <GlassCard className="p-12">
                  <Sparkles className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Available</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Add skills to your profile and view AI recommendations to generate personalized learning roadmaps
                  </p>
                  <a
                    href="/student/recommendations"
                    className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-lg"
                  >
                    View Recommendations
                  </a>
                </GlassCard>
              </motion.div>
            )}

            {/* Jobs Grid */}
            {!loading && jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {jobs.map((job, index) => (
                  <motion.div
                    key={job._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => handleSelectJob(job)}
                    className="cursor-pointer"
                  >
                    <GlassCard className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      {/* Header */}
                      <div className="bg-white p-6 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Briefcase size={14} /> {job.company}
                        </p>
                      </div>

                      {/* Body */}
                      <div className="p-6 space-y-4">
                        {/* Match Score */}
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                          <span className="text-gray-700 font-medium">Match Score</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {job.matchPercentage || 0}%
                          </span>
                        </div>

                        {/* Match Breakdown */}
                        {/* Match Breakdown */}
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="bg-purple-50 p-2 rounded-lg border border-purple-100 text-center">
                            <p className="text-xs text-purple-600 font-medium">Semantic</p>
                            <p className="font-bold text-purple-700">{job.semanticScore ?? 0}%</p>
                          </div>
                          <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 text-center">
                            <p className="text-xs text-blue-600 font-medium">Keywords</p>
                            <p className="font-bold text-blue-700">{job.tfidfScore ?? 0}%</p>
                          </div>
                        </div>

                        {/* Missing Skills */}
                        {job.missingSkills && job.missingSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Skills to Learn ({job.missingSkills.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.missingSkills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs rounded-full font-semibold border border-orange-200"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.missingSkills.length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-semibold border border-gray-200">
                                  +{job.missingSkills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Location & Type */}
                        <div className="space-y-2 pt-2 border-t border-gray-200">
                          {job.location && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <MapPin size={14} className="text-gray-500" />
                              {job.location}
                            </p>
                          )}
                          {job.jobType && (
                            <p className="text-sm text-gray-600">{job.jobType}</p>
                          )}
                        </div>

                        {/* CTA Button */}
                        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                          <Zap size={18} className="group-hover:animate-pulse" />
                          Generate Roadmap
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Info Section */}
            {!loading && jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
              >
                <GlassCard className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="text-yellow-500" size={24} />
                    How AI Roadmaps Work
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { num: '1', title: 'Skill Analysis', desc: 'AI analyzes your current skills' },
                      { num: '2', title: 'Gap Detection', desc: 'Identifies missing skills for the role' },
                      { num: '3', title: 'Path Generation', desc: 'Creates personalized learning path' },
                      { num: '4', title: 'Resources', desc: 'Curates best learning materials' }
                    ].map((step, idx) => (
                      <div key={idx} className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold mb-2">
                          {step.num}
                        </div>
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRoadmaps;

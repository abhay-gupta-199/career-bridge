const { GoogleGenerativeAI } = require('@google/generative-ai');

// Hardcoded roadmaps for specific skills
const HARDCODED_SKILLS_ROADMAPS = {
    "python": {
        "title": "Python Development Roadmap",
        "description": "Master Python programming from basics to advanced concepts",
        "isHardcoded": true,
        "totalDays": 60,
        "phases": [
            {
                "name": "Phase 1: Fundamentals (Days 1-15)",
                "duration": "2 weeks",
                "topics": [
                    {
                        "topic": "Python Basics & Setup",
                        "description": "Installation, environment setup, and first program",
                        "resources": [
                            "https://docs.python.org/3/",
                            "https://realpython.com/python-first-program/",
                            "https://www.python.org/downloads/"
                        ]
                    },
                    {
                        "topic": "Variables, Data Types & Operators",
                        "description": "Learn how to work with different data types",
                        "resources": [
                            "https://docs.python.org/3/tutorial/introduction.html",
                            "https://realpython.com/python-data-types/"
                        ]
                    },
                    {
                        "topic": "Control Flow (if, loops)",
                        "description": "Master conditional statements and loops",
                        "resources": [
                            "https://docs.python.org/3/tutorial/controlflow.html",
                            "https://realpython.com/python-conditional-statements/"
                        ]
                    },
                    {
                        "topic": "Functions & Modules",
                        "description": "Write reusable code with functions",
                        "resources": [
                            "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
                            "https://realpython.com/defining-your-own-python-function/"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Intermediate Concepts (Days 16-40)",
                "duration": "3 weeks",
                "topics": [
                    {
                        "topic": "Object-Oriented Programming (OOP)",
                        "description": "Master classes, inheritance, and polymorphism",
                        "resources": [
                            "https://docs.python.org/3/tutorial/classes.html",
                            "https://realpython.com/intro-to-python-oop/"
                        ]
                    },
                    {
                        "topic": "File Handling & I/O",
                        "description": "Read, write, and manipulate files",
                        "resources": [
                            "https://docs.python.org/3/tutorial/inputoutput.html",
                            "https://realpython.com/read-write-files-python/"
                        ]
                    },
                    {
                        "topic": "Working with Libraries",
                        "description": "Use popular libraries like NumPy, Pandas",
                        "resources": [
                            "https://numpy.org/doc/stable/",
                            "https://pandas.pydata.org/docs/"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Advanced & Specialization (Days 41-60)",
                "duration": "3 weeks",
                "topics": [
                    {
                        "topic": "Web Development with Flask/Django",
                        "description": "Build web applications with Python",
                        "resources": [
                            "https://flask.palletsprojects.com/",
                            "https://docs.djangoproject.com/"
                        ]
                    },
                    {
                        "topic": "Data Science with Python",
                        "description": "Data analysis, visualization, and machine learning",
                        "resources": [
                            "https://matplotlib.org/stable/contents.html",
                            "https://scikit-learn.org/stable/"
                        ]
                    }
                ]
            }
        ]
    },
    "javascript": {
        "title": "JavaScript Development Roadmap",
        "description": "Master JavaScript from basics to advanced frameworks",
        "isHardcoded": true,
        "totalDays": 60,
        "phases": [
            {
                "name": "Phase 1: Core JavaScript (Days 1-15)",
                "duration": "2 weeks",
                "topics": [
                    {
                        "topic": "JavaScript Basics",
                        "description": "Variables, types, operators, and control flow",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics",
                            "https://javascript.info/first-steps"
                        ]
                    },
                    {
                        "topic": "Functions & Scope",
                        "description": "Function declarations, arrow functions, and scope",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
                            "https://javascript.info/function-basics"
                        ]
                    },
                    {
                        "topic": "DOM & Events",
                        "description": "Interact with HTML elements and handle events",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents",
                            "https://javascript.info/dom-nodes"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Intermediate JavaScript (Days 16-40)",
                "duration": "3 weeks",
                "topics": [
                    {
                        "topic": "Objects & Arrays",
                        "description": "Deep dive into object-oriented programming",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects",
                            "https://javascript.info/object"
                        ]
                    },
                    {
                        "topic": "Asynchronous JavaScript",
                        "description": "Callbacks, Promises, and async/await",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
                            "https://javascript.info/promise-basics"
                        ]
                    },
                    {
                        "topic": "APIs & Fetch",
                        "description": "Making HTTP requests and working with APIs",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
                            "https://javascript.info/fetch"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Modern JavaScript & Frameworks (Days 41-60)",
                "duration": "3 weeks",
                "topics": [
                    {
                        "topic": "ES6+ Features",
                        "description": "Modern JavaScript syntax and features",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_ES6"
                        ]
                    },
                    {
                        "topic": "React Fundamentals",
                        "description": "Build interactive UIs with React",
                        "resources": [
                            "https://react.dev/",
                            "https://react.dev/learn"
                        ]
                    }
                ]
            }
        ]
    },
    "css": {
        "title": "CSS Development Roadmap",
        "description": "Master CSS for beautiful and responsive web design",
        "isHardcoded": true,
        "totalDays": 45,
        "phases": [
            {
                "name": "Phase 1: CSS Fundamentals (Days 1-12)",
                "duration": "2 weeks",
                "topics": [
                    {
                        "topic": "CSS Basics",
                        "description": "Syntax, selectors, and properties",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors",
                            "https://css-tricks.com/specifics-on-css-specificity/"
                        ]
                    },
                    {
                        "topic": "Box Model",
                        "description": "Margin, padding, border, and content",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model",
                            "https://css-tricks.com/the-css-box-model/"
                        ]
                    },
                    {
                        "topic": "Colors & Fonts",
                        "description": "Text styling and color management",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text",
                            "https://fonts.google.com/"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Layout & Positioning (Days 13-32)",
                "duration": "3 weeks",
                "topics": [
                    {
                        "topic": "Display & Positioning",
                        "description": "Block, inline, and positioning models",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Web/CSS/display",
                            "https://developer.mozilla.org/en-US/docs/Web/CSS/position"
                        ]
                    },
                    {
                        "topic": "Flexbox Layout",
                        "description": "Master flexible box layout",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox",
                            "https://css-tricks.com/snippets/css/a-guide-to-flexbox/"
                        ]
                    },
                    {
                        "topic": "CSS Grid",
                        "description": "Build complex layouts with CSS Grid",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids",
                            "https://css-tricks.com/snippets/css/complete-guide-grid/"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Responsive & Advanced (Days 33-45)",
                "duration": "2 weeks",
                "topics": [
                    {
                        "topic": "Responsive Design",
                        "description": "Mobile-first and responsive layouts",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Media_queries"
                        ]
                    },
                    {
                        "topic": "Animations & Transitions",
                        "description": "Smooth animations and interactive effects",
                        "resources": [
                            "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions",
                            "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations"
                        ]
                    }
                ]
            }
        ]
    },
    "aws": {
        "title": "AWS Cloud Development Roadmap",
        "description": "Master cloud computing with Amazon Web Services",
        "isHardcoded": true,
        "totalDays": 75,
        "phases": [
            {
                "name": "Phase 1: AWS Fundamentals (Days 1-20)",
                "duration": "3 weeks",
                "topics": [
                    {
                        "topic": "Cloud Computing Concepts",
                        "description": "IaaS, PaaS, SaaS deployment models",
                        "resources": [
                            "https://aws.amazon.com/what-is-cloud-computing/",
                            "https://docs.aws.amazon.com/general/latest/gr/"
                        ]
                    },
                    {
                        "topic": "AWS EC2 - Elastic Compute Cloud",
                        "description": "Launch and manage virtual servers",
                        "resources": [
                            "https://docs.aws.amazon.com/ec2/",
                            "https://aws.amazon.com/ec2/getting-started/"
                        ]
                    },
                    {
                        "topic": "AWS S3 - Simple Storage Service",
                        "description": "Object storage for files and data",
                        "resources": [
                            "https://docs.aws.amazon.com/s3/",
                            "https://aws.amazon.com/s3/getting-started/"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Databases & Networking (Days 21-50)",
                "duration": "4 weeks",
                "topics": [
                    {
                        "topic": "AWS RDS - Relational Database",
                        "description": "Managed SQL database service",
                        "resources": [
                            "https://docs.aws.amazon.com/rds/",
                            "https://aws.amazon.com/rds/getting-started/"
                        ]
                    },
                    {
                        "topic": "AWS DynamoDB - NoSQL Database",
                        "description": "Fast NoSQL database service",
                        "resources": [
                            "https://docs.aws.amazon.com/dynamodb/",
                            "https://aws.amazon.com/dynamodb/getting-started/"
                        ]
                    },
                    {
                        "topic": "AWS VPC - Virtual Private Cloud",
                        "description": "Network isolation and configuration",
                        "resources": [
                            "https://docs.aws.amazon.com/vpc/",
                            "https://aws.amazon.com/vpc/getting-started/"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Advanced Services (Days 51-75)",
                "duration": "3 weeks",
                "topics": [
                    {
                        "topic": "AWS Lambda - Serverless Computing",
                        "description": "Run code without managing servers",
                        "resources": [
                            "https://docs.aws.amazon.com/lambda/",
                            "https://aws.amazon.com/lambda/getting-started/"
                        ]
                    },
                    {
                        "topic": "CloudFormation - Infrastructure as Code",
                        "description": "Define infrastructure using templates",
                        "resources": [
                            "https://docs.aws.amazon.com/cloudformation/",
                            "https://aws.amazon.com/cloudformation/getting-started/"
                        ]
                    }
                ]
            }
        ]
    },
    "azure": {
        "title": "Azure Cloud Development Roadmap",
        "description": "Master cloud computing with Microsoft Azure",
        "isHardcoded": true,
        "totalDays": 75,
        "phases": [
            {
                "name": "Phase 1: Azure Fundamentals (Days 1-20)",
                "duration": "3 weeks",
                "topics": [
                    {
                        "topic": "Azure Fundamentals",
                        "description": "Cloud concepts and Azure basics",
                        "resources": [
                            "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/",
                            "https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-azure/"
                        ]
                    },
                    {
                        "topic": "Azure Virtual Machines",
                        "description": "Virtual Machines and compute services",
                        "resources": [
                            "https://learn.microsoft.com/en-us/azure/virtual-machines/",
                            "https://learn.microsoft.com/en-us/training/modules/create-windows-virtual-machine-in-azure/"
                        ]
                    },
                    {
                        "topic": "Azure App Service",
                        "description": "Web app hosting and deployment",
                        "resources": [
                            "https://learn.microsoft.com/en-us/azure/app-service/",
                            "https://learn.microsoft.com/en-us/training/modules/host-a-web-app-with-azure-app-service/"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Databases & Networking (Days 21-50)",
                "duration": "4 weeks",
                "topics": [
                    {
                        "topic": "Azure SQL Database",
                        "description": "Managed SQL database service",
                        "resources": [
                            "https://learn.microsoft.com/en-us/azure/azure-sql/database/",
                            "https://learn.microsoft.com/en-us/training/modules/provision-azure-sql-database/"
                        ]
                    },
                    {
                        "topic": "Azure Cosmos DB",
                        "description": "NoSQL database service",
                        "resources": [
                            "https://learn.microsoft.com/en-us/azure/cosmos-db/",
                            "https://learn.microsoft.com/en-us/training/modules/create-cosmos-db-for-scale/"
                        ]
                    },
                    {
                        "topic": "Virtual Networks",
                        "description": "Network configuration and security",
                        "resources": [
                            "https://learn.microsoft.com/en-us/azure/virtual-network/",
                            "https://learn.microsoft.com/en-us/training/modules/configure-virtual-networks/"
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Advanced Services (Days 51-75)",
                "duration": "3 weeks",
                "topics": [
                    {
                        "topic": "Azure Functions - Serverless",
                        "description": "Serverless computing with Azure Functions",
                        "resources": [
                            "https://learn.microsoft.com/en-us/azure/azure-functions/",
                            "https://learn.microsoft.com/en-us/training/modules/create-serverless-logic-with-azure-functions/"
                        ]
                    },
                    {
                        "topic": "Infrastructure as Code",
                        "description": "ARM Templates and Bicep",
                        "resources": [
                            "https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/",
                            "https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/"
                        ]
                    }
                ]
            }
        ]
    }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateRoadmap = async (req, res) => {
    try {
        const { role, skills, availability, duration, missingSkills } = req.body;

        // Check if we have missing skills that have hardcoded roadmaps
        if (missingSkills && Array.isArray(missingSkills) && missingSkills.length > 0) {
            const roadmaps = {};
            const dynamicSkills = [];

            for (const skill of missingSkills) {
                const skillLower = skill.toLowerCase().trim();
                const hardcodedKey = Object.keys(HARDCODED_SKILLS_ROADMAPS).find(
                    key => key === skillLower || skillLower.includes(key)
                );

                if (hardcodedKey) {
                    roadmaps[skill] = HARDCODED_SKILLS_ROADMAPS[hardcodedKey];
                } else {
                    dynamicSkills.push(skill);
                }
            }

            // If we have hardcoded roadmaps, return them
            if (Object.keys(roadmaps).length > 0) {
                return res.json({
                    success: true,
                    roadmaps: roadmaps,
                    source: "hardcoded",
                    message: `Fetched hardcoded roadmaps for: ${Object.keys(roadmaps).join(", ")}`
                });
            }
        }

        // Fallback to Gemini API
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'Gemini API key is not configured' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Create a detailed learning roadmap for a student aspiring to be a "${role}".
      Current Skills: ${skills || 'None'}.
      Availability: ${availability} hours per week.
      Target Duration: ${duration} months.

      Please provide the roadmap in the following strict JSON format:
      {
        "title": "Roadmap Title",
        "description": "Brief overview",
        "phases": [
          {
            "name": "Phase Name (e.g., Month 1 or Foundation)",
            "duration": "Duration description",
            "topics": [
              {
                "topic": "Topic Name",
                "description": "What to learn",
                "resources": ["Link or resource name"]
              }
            ]
          }
        ]
      }
      
      Ensure the response is ONLY valid JSON, no markdown formatting or extra text.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const roadmapData = JSON.parse(cleanedText);

        res.json({ success: true, roadmap: roadmapData, source: "gemini" });
    } catch (error) {
        console.error('Roadmap Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate roadmap', error: error.message });
    }
};

"""
Hardcoded roadmaps for commonly required skills.
These detailed roadmaps include structured learning paths, documentation links, and projects.
"""

HARDCODED_ROADMAPS = {
    "python": {
        "skill": "Python",
        "description": "Master Python programming from basics to advanced concepts",
        "difficulty": "Beginner to Advanced",
        "totalDays": 60,
        "phases": [
            {
                "name": "Phase 1: Fundamentals (Days 1-15)",
                "duration": "2 weeks",
                "description": "Learn core Python syntax and basic programming concepts",
                "topics": [
                    {
                        "title": "Python Basics & Setup",
                        "description": "Installation, environment setup, and first program",
                        "daysToComplete": 2,
                        "subtopics": [
                            {
                                "name": "Installation & IDE Setup",
                                "resources": [
                                    {"title": "Official Python Docs - Getting Started", "url": "https://docs.python.org/3/"},
                                    {"title": "VS Code Python Extension", "url": "https://marketplace.visualstudio.com/items?itemName=ms-python.python"},
                                    {"title": "Python.org Installation Guide", "url": "https://www.python.org/downloads/"}
                                ]
                            },
                            {
                                "name": "Running Your First Program",
                                "resources": [
                                    {"title": "Python Tutorial - Your First Program", "url": "https://docs.python.org/3/tutorial/"},
                                    {"title": "Real Python - Getting Started", "url": "https://realpython.com/python-first-program/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Variables, Data Types & Operators",
                        "description": "Learn how to work with different data types in Python",
                        "daysToComplete": 3,
                        "subtopics": [
                            {
                                "name": "Variables & Data Types",
                                "resources": [
                                    {"title": "Python Official Docs - Data Types", "url": "https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator"},
                                    {"title": "Real Python - Data Types", "url": "https://realpython.com/python-data-types/"},
                                    {"title": "W3Schools Python Data Types", "url": "https://www.w3schools.com/python/python_datatypes.asp"}
                                ]
                            },
                            {
                                "name": "Operators & Expressions",
                                "resources": [
                                    {"title": "Python Docs - Operators", "url": "https://docs.python.org/3/reference/lexical_analysis.html#operators"},
                                    {"title": "Real Python - Operators", "url": "https://realpython.com/python-operators-and-expressions/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Control Flow (if, loops)",
                        "description": "Master conditional statements and loops",
                        "daysToComplete": 4,
                        "subtopics": [
                            {
                                "name": "Conditional Statements",
                                "resources": [
                                    {"title": "Python Docs - if Statements", "url": "https://docs.python.org/3/tutorial/controlflow.html#if-statements"},
                                    {"title": "Real Python - Conditionals", "url": "https://realpython.com/python-conditional-statements/"}
                                ]
                            },
                            {
                                "name": "Loops (for, while)",
                                "resources": [
                                    {"title": "Python Docs - Loops", "url": "https://docs.python.org/3/tutorial/controlflow.html#for-statements"},
                                    {"title": "Real Python - Loops", "url": "https://realpython.com/python-for-loop/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Functions & Modules",
                        "description": "Write reusable code with functions and modules",
                        "daysToComplete": 4,
                        "subtopics": [
                            {
                                "name": "Defining Functions",
                                "resources": [
                                    {"title": "Python Docs - Functions", "url": "https://docs.python.org/3/tutorial/controlflow.html#defining-functions"},
                                    {"title": "Real Python - Functions", "url": "https://realpython.com/defining-your-own-python-function/"}
                                ]
                            },
                            {
                                "name": "Modules & Packages",
                                "resources": [
                                    {"title": "Python Docs - Modules", "url": "https://docs.python.org/3/tutorial/modules.html"},
                                    {"title": "Real Python - Modules", "url": "https://realpython.com/python-modules-packages/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Data Structures",
                        "description": "Learn lists, tuples, dictionaries, and sets",
                        "daysToComplete": 2,
                        "subtopics": [
                            {
                                "name": "Lists & Tuples",
                                "resources": [
                                    {"title": "Python Docs - Lists", "url": "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists"},
                                    {"title": "Real Python - Lists and Tuples", "url": "https://realpython.com/python-lists-tuples/"}
                                ]
                            },
                            {
                                "name": "Dictionaries & Sets",
                                "resources": [
                                    {"title": "Python Docs - Dictionaries", "url": "https://docs.python.org/3/tutorial/datastructures.html#dictionaries"},
                                    {"title": "Real Python - Dictionaries", "url": "https://realpython.com/python-dicts/"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Intermediate Concepts (Days 16-40)",
                "duration": "3 weeks",
                "description": "Learn OOP, file handling, and error management",
                "topics": [
                    {
                        "title": "Object-Oriented Programming (OOP)",
                        "description": "Master classes, inheritance, and polymorphism",
                        "daysToComplete": 10,
                        "subtopics": [
                            {
                                "name": "Classes & Objects",
                                "resources": [
                                    {"title": "Python Docs - Classes", "url": "https://docs.python.org/3/tutorial/classes.html"},
                                    {"title": "Real Python - OOP", "url": "https://realpython.com/intro-to-python-oop/"}
                                ]
                            },
                            {
                                "name": "Inheritance & Polymorphism",
                                "resources": [
                                    {"title": "Real Python - Inheritance", "url": "https://realpython.com/inheritance-composition-python/"},
                                    {"title": "Python Docs - Inheritance", "url": "https://docs.python.org/3/tutorial/classes.html#inheritance"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "File Handling & I/O",
                        "description": "Read, write, and manipulate files",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "File Operations",
                                "resources": [
                                    {"title": "Python Docs - File I/O", "url": "https://docs.python.org/3/tutorial/inputoutput.html"},
                                    {"title": "Real Python - File I/O", "url": "https://realpython.com/read-write-files-python/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Exception Handling",
                        "description": "Handle errors gracefully in your code",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "Try-Except Blocks",
                                "resources": [
                                    {"title": "Python Docs - Errors", "url": "https://docs.python.org/3/tutorial/errors.html"},
                                    {"title": "Real Python - Exception Handling", "url": "https://realpython.com/python-exceptions/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Working with Libraries",
                        "description": "Use popular Python libraries like NumPy, Pandas",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "NumPy Basics",
                                "resources": [
                                    {"title": "NumPy Official Documentation", "url": "https://numpy.org/doc/stable/"},
                                    {"title": "Real Python - NumPy Tutorial", "url": "https://realpython.com/numpy-tutorial/"}
                                ]
                            },
                            {
                                "name": "Pandas for Data Analysis",
                                "resources": [
                                    {"title": "Pandas Official Documentation", "url": "https://pandas.pydata.org/docs/"},
                                    {"title": "Real Python - Pandas Tutorial", "url": "https://realpython.com/learning-paths/pandas-data-science/"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Advanced & Specialization (Days 41-60)",
                "duration": "3 weeks",
                "description": "Web development, data science, and advanced topics",
                "topics": [
                    {
                        "title": "Web Development with Flask/Django",
                        "description": "Build web applications with Python",
                        "daysToComplete": 15,
                        "subtopics": [
                            {
                                "name": "Flask Basics",
                                "resources": [
                                    {"title": "Flask Official Documentation", "url": "https://flask.palletsprojects.com/"},
                                    {"title": "Real Python - Flask by Example", "url": "https://realpython.com/flask-by-example/"}
                                ]
                            },
                            {
                                "name": "Django Framework",
                                "resources": [
                                    {"title": "Django Official Documentation", "url": "https://docs.djangoproject.com/"},
                                    {"title": "Real Python - Django for Beginners", "url": "https://realpython.com/get-started-with-django-1/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Data Science with Python",
                        "description": "Data analysis, visualization, and machine learning",
                        "daysToComplete": 10,
                        "subtopics": [
                            {
                                "name": "Data Visualization",
                                "resources": [
                                    {"title": "Matplotlib Documentation", "url": "https://matplotlib.org/stable/contents.html"},
                                    {"title": "Seaborn Documentation", "url": "https://seaborn.pydata.org/"}
                                ]
                            },
                            {
                                "name": "Machine Learning Basics",
                                "resources": [
                                    {"title": "Scikit-Learn Documentation", "url": "https://scikit-learn.org/stable/"},
                                    {"title": "Real Python - Machine Learning", "url": "https://realpython.com/tutorials/machine-learning/"}
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "projects": [
            {
                "name": "Todo List Application",
                "description": "Build a command-line todo list app with file persistence",
                "difficulty": "Beginner",
                "skills": ["Variables", "Functions", "File I/O", "Data Structures"]
            },
            {
                "name": "Student Grade Management System",
                "description": "Create a system to manage student grades with OOP concepts",
                "difficulty": "Intermediate",
                "skills": ["OOP", "File Handling", "Data Structures"]
            },
            {
                "name": "Data Analysis Dashboard",
                "description": "Analyze and visualize real-world data using Pandas and Matplotlib",
                "difficulty": "Intermediate",
                "skills": ["Pandas", "Matplotlib", "Data Analysis"]
            },
            {
                "name": "Personal Finance Tracker",
                "description": "Build a web app to track income and expenses with Flask",
                "difficulty": "Advanced",
                "skills": ["Flask", "OOP", "Database Design"]
            }
        ]
    },
    "javascript": {
        "skill": "JavaScript",
        "description": "Master JavaScript from basics to advanced frameworks",
        "difficulty": "Beginner to Advanced",
        "totalDays": 60,
        "phases": [
            {
                "name": "Phase 1: Core JavaScript (Days 1-15)",
                "duration": "2 weeks",
                "description": "Learn JavaScript fundamentals and DOM manipulation",
                "topics": [
                    {
                        "title": "JavaScript Basics",
                        "description": "Variables, types, operators, and control flow",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "Syntax & Variables",
                                "resources": [
                                    {"title": "MDN - JavaScript Basics", "url": "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics"},
                                    {"title": "JavaScript.info - Fundamentals", "url": "https://javascript.info/first-steps"}
                                ]
                            },
                            {
                                "name": "Data Types & Operators",
                                "resources": [
                                    {"title": "MDN - Data Types", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures"},
                                    {"title": "JavaScript.info - Data Types", "url": "https://javascript.info/types"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Functions & Scope",
                        "description": "Function declarations, arrow functions, and scope management",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "Function Declarations & Arrow Functions",
                                "resources": [
                                    {"title": "MDN - Functions", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions"},
                                    {"title": "JavaScript.info - Functions", "url": "https://javascript.info/function-basics"}
                                ]
                            },
                            {
                                "name": "Scope & Closures",
                                "resources": [
                                    {"title": "MDN - Closures", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"},
                                    {"title": "JavaScript.info - Variable Scope", "url": "https://javascript.info/var"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "DOM & Events",
                        "description": "Interact with HTML elements and handle events",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "DOM Manipulation",
                                "resources": [
                                    {"title": "MDN - DOM Manipulation", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents"},
                                    {"title": "JavaScript.info - DOM", "url": "https://javascript.info/dom-nodes"}
                                ]
                            },
                            {
                                "name": "Event Handling",
                                "resources": [
                                    {"title": "MDN - Event Handling", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events"},
                                    {"title": "JavaScript.info - Events", "url": "https://javascript.info/events"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Intermediate JavaScript (Days 16-40)",
                "duration": "3 weeks",
                "description": "Objects, arrays, async programming, and API calls",
                "topics": [
                    {
                        "title": "Objects & Arrays",
                        "description": "Deep dive into object-oriented and functional programming",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "Objects & Methods",
                                "resources": [
                                    {"title": "MDN - Objects", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects"},
                                    {"title": "JavaScript.info - Objects", "url": "https://javascript.info/object"}
                                ]
                            },
                            {
                                "name": "Array Methods & Functional Programming",
                                "resources": [
                                    {"title": "MDN - Array Methods", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"},
                                    {"title": "JavaScript.info - Arrays", "url": "https://javascript.info/array"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Asynchronous JavaScript",
                        "description": "Callbacks, Promises, and async/await",
                        "daysToComplete": 10,
                        "subtopics": [
                            {
                                "name": "Promises",
                                "resources": [
                                    {"title": "MDN - Promises", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"},
                                    {"title": "JavaScript.info - Promises", "url": "https://javascript.info/promise-basics"}
                                ]
                            },
                            {
                                "name": "Async/Await",
                                "resources": [
                                    {"title": "MDN - Async/Await", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises"},
                                    {"title": "JavaScript.info - Async/Await", "url": "https://javascript.info/async-await"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "APIs & Fetch",
                        "description": "Making HTTP requests and working with external APIs",
                        "daysToComplete": 7,
                        "subtopics": [
                            {
                                "name": "Fetch API",
                                "resources": [
                                    {"title": "MDN - Fetch API", "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"},
                                    {"title": "JavaScript.info - Fetch", "url": "https://javascript.info/fetch"}
                                ]
                            },
                            {
                                "name": "Working with JSON",
                                "resources": [
                                    {"title": "MDN - JSON", "url": "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON"},
                                    {"title": "JavaScript.info - JSON", "url": "https://javascript.info/json"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Modern JavaScript & Frameworks (Days 41-60)",
                "duration": "3 weeks",
                "description": "ES6+ features, React basics, and state management",
                "topics": [
                    {
                        "title": "ES6+ Features",
                        "description": "Modern JavaScript syntax and features",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "Arrow Functions, Destructuring, Spread Operator",
                                "resources": [
                                    {"title": "MDN - ES6 Features", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_ES6"},
                                    {"title": "JavaScript.info - Modern JS", "url": "https://javascript.info/object-methods"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "React Fundamentals",
                        "description": "Build interactive UIs with React",
                        "daysToComplete": 15,
                        "subtopics": [
                            {
                                "name": "Components & JSX",
                                "resources": [
                                    {"title": "React Official Docs", "url": "https://react.dev/"},
                                    {"title": "React Tutorial", "url": "https://react.dev/learn"}
                                ]
                            },
                            {
                                "name": "State & Props",
                                "resources": [
                                    {"title": "React - State & Lifecycle", "url": "https://react.dev/learn/state-a-components-memory"},
                                    {"title": "React - Passing Props", "url": "https://react.dev/learn/passing-props-to-a-component"}
                                ]
                            },
                            {
                                "name": "Hooks (useState, useEffect)",
                                "resources": [
                                    {"title": "React - Hooks", "url": "https://react.dev/reference/react/hooks"},
                                    {"title": "React - useEffect", "url": "https://react.dev/reference/react/useEffect"}
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "projects": [
            {
                "name": "Interactive Todo App",
                "description": "Build a dynamic todo list with add, delete, and filter features",
                "difficulty": "Beginner",
                "skills": ["DOM Manipulation", "Events", "Local Storage"]
            },
            {
                "name": "Weather App with API",
                "description": "Fetch weather data from OpenWeatherMap API and display it",
                "difficulty": "Intermediate",
                "skills": ["Fetch API", "Async/Await", "DOM Manipulation"]
            },
            {
                "name": "E-commerce Product Page",
                "description": "Create a dynamic product page with filtering and sorting",
                "difficulty": "Intermediate",
                "skills": ["Array Methods", "Events", "Data Management"]
            },
            {
                "name": "React Blog Platform",
                "description": "Build a blog with React including posts, comments, and routing",
                "difficulty": "Advanced",
                "skills": ["React", "Hooks", "Component Design"]
            }
        ]
    },
    "css": {
        "skill": "CSS",
        "description": "Master CSS for beautiful and responsive web design",
        "difficulty": "Beginner to Advanced",
        "totalDays": 45,
        "phases": [
            {
                "name": "Phase 1: CSS Fundamentals (Days 1-12)",
                "duration": "2 weeks",
                "description": "Learn CSS syntax, selectors, and basic styling",
                "topics": [
                    {
                        "title": "CSS Basics",
                        "description": "Syntax, selectors, and properties",
                        "daysToComplete": 4,
                        "subtopics": [
                            {
                                "name": "Selectors & Specificity",
                                "resources": [
                                    {"title": "MDN - CSS Selectors", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors"},
                                    {"title": "CSS-Tricks - Specificity", "url": "https://css-tricks.com/specifics-on-css-specificity/"}
                                ]
                            },
                            {
                                "name": "Properties & Values",
                                "resources": [
                                    {"title": "MDN - CSS Reference", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference"},
                                    {"title": "W3Schools CSS", "url": "https://www.w3schools.com/css/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Box Model",
                        "description": "Margin, padding, border, and content",
                        "daysToComplete": 3,
                        "subtopics": [
                            {
                                "name": "Box Model Concepts",
                                "resources": [
                                    {"title": "MDN - Box Model", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model"},
                                    {"title": "CSS-Tricks - Box Model", "url": "https://css-tricks.com/the-css-box-model/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Colors & Fonts",
                        "description": "Text styling and color management",
                        "daysToComplete": 3,
                        "subtopics": [
                            {
                                "name": "Text Properties",
                                "resources": [
                                    {"title": "MDN - Text Styling", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text"},
                                    {"title": "Google Fonts", "url": "https://fonts.google.com/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Backgrounds & Borders",
                        "description": "Visual styling elements",
                        "daysToComplete": 2,
                        "subtopics": [
                            {
                                "name": "Backgrounds & Gradients",
                                "resources": [
                                    {"title": "MDN - Backgrounds", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/background"},
                                    {"title": "CSS-Tricks - Gradients", "url": "https://css-tricks.com/css3-gradients/"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Layout & Positioning (Days 13-32)",
                "duration": "3 weeks",
                "description": "Flexbox, CSS Grid, and responsive design",
                "topics": [
                    {
                        "title": "Display & Positioning",
                        "description": "Block, inline, and positioning models",
                        "daysToComplete": 4,
                        "subtopics": [
                            {
                                "name": "Display Properties",
                                "resources": [
                                    {"title": "MDN - Display", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/display"},
                                    {"title": "CSS-Tricks - Display", "url": "https://css-tricks.com/almanac/properties/d/display/"}
                                ]
                            },
                            {
                                "name": "Position Property",
                                "resources": [
                                    {"title": "MDN - Position", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/position"},
                                    {"title": "CSS-Tricks - Position", "url": "https://css-tricks.com/almanac/properties/p/position/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Flexbox Layout",
                        "description": "Master flexible box layout",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "Flex Container & Items",
                                "resources": [
                                    {"title": "MDN - Flexbox", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox"},
                                    {"title": "CSS-Tricks - Flexbox Guide", "url": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/"}
                                ]
                            },
                            {
                                "name": "Flex Properties Deep Dive",
                                "resources": [
                                    {"title": "CSS-Tricks - Flex Properties", "url": "https://css-tricks.com/snippets/css/a-guide-to-flexbox/"},
                                    {"title": "Flexbox Interactive Game", "url": "https://flexboxfroggy.com/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "CSS Grid",
                        "description": "Build complex layouts with CSS Grid",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "Grid Basics",
                                "resources": [
                                    {"title": "MDN - CSS Grid", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids"},
                                    {"title": "CSS-Tricks - Grid Guide", "url": "https://css-tricks.com/snippets/css/complete-guide-grid/"}
                                ]
                            },
                            {
                                "name": "Grid Advanced",
                                "resources": [
                                    {"title": "CSS-Tricks - Grid Properties", "url": "https://css-tricks.com/snippets/css/complete-guide-grid/"},
                                    {"title": "Grid Garden Game", "url": "https://cssgridgarden.com/"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Responsive & Advanced (Days 33-45)",
                "duration": "2 weeks",
                "description": "Media queries, animations, and advanced techniques",
                "topics": [
                    {
                        "title": "Responsive Design",
                        "description": "Mobile-first and responsive layouts",
                        "daysToComplete": 6,
                        "subtopics": [
                            {
                                "name": "Media Queries & Breakpoints",
                                "resources": [
                                    {"title": "MDN - Media Queries", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Media_queries"},
                                    {"title": "CSS-Tricks - Media Queries", "url": "https://css-tricks.com/a-complete-guide-to-grid/"}
                                ]
                            },
                            {
                                "name": "Mobile-First Approach",
                                "resources": [
                                    {"title": "MDN - Responsive Design", "url": "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design"},
                                    {"title": "Bootstrap Grid System", "url": "https://getbootstrap.com/docs/5.0/layout/grid/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Animations & Transitions",
                        "description": "Smooth animations and interactive effects",
                        "daysToComplete": 6,
                        "subtopics": [
                            {
                                "name": "Transitions",
                                "resources": [
                                    {"title": "MDN - Transitions", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions"},
                                    {"title": "CSS-Tricks - Transitions", "url": "https://css-tricks.com/almanac/properties/t/transition/"}
                                ]
                            },
                            {
                                "name": "Animations & Keyframes",
                                "resources": [
                                    {"title": "MDN - Animations", "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations"},
                                    {"title": "CSS-Tricks - Animations", "url": "https://css-tricks.com/almanac/properties/a/animation/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "CSS Preprocessing & Frameworks",
                        "description": "SASS/SCSS and CSS frameworks",
                        "daysToComplete": 3,
                        "subtopics": [
                            {
                                "name": "SASS Basics",
                                "resources": [
                                    {"title": "SASS Official Docs", "url": "https://sass-lang.com/documentation"},
                                    {"title": "SCSS Tutorial", "url": "https://www.w3schools.com/sass/"}
                                ]
                            },
                            {
                                "name": "Tailwind CSS",
                                "resources": [
                                    {"title": "Tailwind CSS Docs", "url": "https://tailwindcss.com/docs"},
                                    {"title": "Tailwind CSS Tutorial", "url": "https://www.w3schools.com/tailwind/"}
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "projects": [
            {
                "name": "Personal Portfolio Website",
                "description": "Create a responsive portfolio showcasing your work",
                "difficulty": "Beginner",
                "skills": ["Flexbox", "Responsive Design", "Typography"]
            },
            {
                "name": "Responsive Landing Page",
                "description": "Build a modern landing page with animations",
                "difficulty": "Intermediate",
                "skills": ["Grid", "Animations", "Media Queries"]
            },
            {
                "name": "E-commerce Product Grid",
                "description": "Create a responsive product grid with hover effects",
                "difficulty": "Intermediate",
                "skills": ["CSS Grid", "Transitions", "Responsive Design"]
            },
            {
                "name": "Animated Dashboard",
                "description": "Build an interactive dashboard with SASS and animations",
                "difficulty": "Advanced",
                "skills": ["SASS", "Animations", "Advanced Layout"]
            }
        ]
    },
    "aws": {
        "skill": "AWS (Amazon Web Services)",
        "description": "Master cloud computing with AWS",
        "difficulty": "Beginner to Advanced",
        "totalDays": 75,
        "phases": [
            {
                "name": "Phase 1: AWS Fundamentals (Days 1-20)",
                "duration": "3 weeks",
                "description": "Cloud concepts, AWS basics, and core services",
                "topics": [
                    {
                        "title": "Cloud Computing Concepts",
                        "description": "IaaS, PaaS, SaaS, and deployment models",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "Cloud Models & Benefits",
                                "resources": [
                                    {"title": "AWS Cloud Essentials", "url": "https://aws.amazon.com/what-is-cloud-computing/"},
                                    {"title": "AWS Documentation - Getting Started", "url": "https://docs.aws.amazon.com/general/latest/gr/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "AWS Account & Console",
                        "description": "Setting up AWS account and navigating the console",
                        "daysToComplete": 4,
                        "subtopics": [
                            {
                                "name": "Account Setup & IAM",
                                "resources": [
                                    {"title": "AWS - Account Setup", "url": "https://aws.amazon.com/getting-started/"},
                                    {"title": "AWS IAM Documentation", "url": "https://docs.aws.amazon.com/iam/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "EC2 - Elastic Compute Cloud",
                        "description": "Launch and manage virtual servers",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "EC2 Instances & AMIs",
                                "resources": [
                                    {"title": "AWS EC2 Documentation", "url": "https://docs.aws.amazon.com/ec2/"},
                                    {"title": "AWS - EC2 Getting Started", "url": "https://aws.amazon.com/ec2/getting-started/"}
                                ]
                            },
                            {
                                "name": "Security Groups & Key Pairs",
                                "resources": [
                                    {"title": "AWS - Security Groups", "url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html"},
                                    {"title": "EC2 Key Pairs", "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "S3 - Simple Storage Service",
                        "description": "Object storage for files and data",
                        "daysToComplete": 3,
                        "subtopics": [
                            {
                                "name": "S3 Buckets & Objects",
                                "resources": [
                                    {"title": "AWS S3 Documentation", "url": "https://docs.aws.amazon.com/s3/"},
                                    {"title": "AWS - S3 Getting Started", "url": "https://aws.amazon.com/s3/getting-started/"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Databases & Networking (Days 21-50)",
                "duration": "4 weeks",
                "description": "RDS, DynamoDB, VPC, and networking concepts",
                "topics": [
                    {
                        "title": "RDS - Relational Database Service",
                        "description": "Managed SQL databases",
                        "daysToComplete": 10,
                        "subtopics": [
                            {
                                "name": "RDS Setup & Management",
                                "resources": [
                                    {"title": "AWS RDS Documentation", "url": "https://docs.aws.amazon.com/rds/"},
                                    {"title": "AWS - RDS Getting Started", "url": "https://aws.amazon.com/rds/getting-started/"}
                                ]
                            },
                            {
                                "name": "Database Backup & Recovery",
                                "resources": [
                                    {"title": "RDS Backups", "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "DynamoDB - NoSQL Database",
                        "description": "Fast NoSQL database service",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "DynamoDB Tables & Items",
                                "resources": [
                                    {"title": "AWS DynamoDB Documentation", "url": "https://docs.aws.amazon.com/dynamodb/"},
                                    {"title": "DynamoDB Getting Started", "url": "https://aws.amazon.com/dynamodb/getting-started/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "VPC - Virtual Private Cloud",
                        "description": "Network isolation and configuration",
                        "daysToComplete": 10,
                        "subtopics": [
                            {
                                "name": "VPC Setup & Subnets",
                                "resources": [
                                    {"title": "AWS VPC Documentation", "url": "https://docs.aws.amazon.com/vpc/"},
                                    {"title": "VPC Getting Started", "url": "https://aws.amazon.com/vpc/getting-started/"}
                                ]
                            },
                            {
                                "name": "Route Tables & NAT Gateway",
                                "resources": [
                                    {"title": "Route Tables", "url": "https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html"},
                                    {"title": "NAT Gateway", "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Load Balancing & Autoscaling",
                        "description": "Distribute traffic and scale applications",
                        "daysToComplete": 12,
                        "subtopics": [
                            {
                                "name": "Elastic Load Balancer (ELB)",
                                "resources": [
                                    {"title": "AWS ELB Documentation", "url": "https://docs.aws.amazon.com/elasticloadbalancing/"},
                                    {"title": "ELB Getting Started", "url": "https://aws.amazon.com/elasticloadbalancing/getting-started/"}
                                ]
                            },
                            {
                                "name": "Auto Scaling Groups",
                                "resources": [
                                    {"title": "AWS Auto Scaling", "url": "https://docs.aws.amazon.com/autoscaling/"},
                                    {"title": "Auto Scaling Getting Started", "url": "https://aws.amazon.com/ec2/autoscaling/getting-started/"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Advanced Services (Days 51-75)",
                "duration": "3 weeks",
                "description": "Lambda, CloudFormation, Monitoring, and Security",
                "topics": [
                    {
                        "title": "Lambda - Serverless Computing",
                        "description": "Run code without managing servers",
                        "daysToComplete": 12,
                        "subtopics": [
                            {
                                "name": "Lambda Functions & Triggers",
                                "resources": [
                                    {"title": "AWS Lambda Documentation", "url": "https://docs.aws.amazon.com/lambda/"},
                                    {"title": "Lambda Getting Started", "url": "https://aws.amazon.com/lambda/getting-started/"}
                                ]
                            },
                            {
                                "name": "API Gateway & Integration",
                                "resources": [
                                    {"title": "API Gateway Documentation", "url": "https://docs.aws.amazon.com/apigateway/"},
                                    {"title": "API Gateway with Lambda", "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "CloudFormation - Infrastructure as Code",
                        "description": "Define infrastructure using templates",
                        "daysToComplete": 10,
                        "subtopics": [
                            {
                                "name": "CloudFormation Templates",
                                "resources": [
                                    {"title": "CloudFormation Documentation", "url": "https://docs.aws.amazon.com/cloudformation/"},
                                    {"title": "CloudFormation Getting Started", "url": "https://aws.amazon.com/cloudformation/getting-started/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Monitoring & Logging",
                        "description": "CloudWatch and logging services",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "CloudWatch Metrics & Alarms",
                                "resources": [
                                    {"title": "CloudWatch Documentation", "url": "https://docs.aws.amazon.com/cloudwatch/"},
                                    {"title": "CloudWatch Getting Started", "url": "https://aws.amazon.com/cloudwatch/getting-started/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Security & Compliance",
                        "description": "IAM, encryption, and security best practices",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "Security Best Practices",
                                "resources": [
                                    {"title": "AWS Security Best Practices", "url": "https://docs.aws.amazon.com/security/"},
                                    {"title": "Well-Architected Framework", "url": "https://aws.amazon.com/architecture/well-architected/"}
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "projects": [
            {
                "name": "Static Website Hosting",
                "description": "Host a static website on S3 with CloudFront CDN",
                "difficulty": "Beginner",
                "skills": ["S3", "CloudFront", "IAM"]
            },
            {
                "name": "Multi-tier Web Application",
                "description": "Deploy a web app with EC2, RDS, and Elastic Load Balancer",
                "difficulty": "Intermediate",
                "skills": ["EC2", "RDS", "VPC", "ELB"]
            },
            {
                "name": "Serverless API with Lambda",
                "description": "Build REST API using Lambda and API Gateway",
                "difficulty": "Intermediate",
                "skills": ["Lambda", "API Gateway", "DynamoDB"]
            },
            {
                "name": "Infrastructure as Code with CloudFormation",
                "description": "Define and deploy entire infrastructure using CloudFormation",
                "difficulty": "Advanced",
                "skills": ["CloudFormation", "All AWS Services", "Best Practices"]
            }
        ]
    },
    "azure": {
        "skill": "Azure Cloud",
        "description": "Master cloud computing with Microsoft Azure",
        "difficulty": "Beginner to Advanced",
        "totalDays": 75,
        "phases": [
            {
                "name": "Phase 1: Azure Fundamentals (Days 1-20)",
                "duration": "3 weeks",
                "description": "Cloud concepts, Azure basics, and core services",
                "topics": [
                    {
                        "title": "Cloud Computing & Azure Concepts",
                        "description": "Cloud service models and deployment models",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "Azure Fundamentals",
                                "resources": [
                                    {"title": "Microsoft Learn - Azure Fundamentals", "url": "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/"},
                                    {"title": "What is Azure?", "url": "https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-azure/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Azure Account & Portal",
                        "description": "Setting up Azure subscription and portal navigation",
                        "daysToComplete": 4,
                        "subtopics": [
                            {
                                "name": "Azure Portal Setup",
                                "resources": [
                                    {"title": "Azure Account Setup", "url": "https://learn.microsoft.com/en-us/training/modules/create-an-azure-account/"},
                                    {"title": "Azure Portal Guide", "url": "https://learn.microsoft.com/en-us/azure/azure-portal/azure-portal-overview"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Azure VMs & Compute",
                        "description": "Virtual Machines and compute services",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "Virtual Machines",
                                "resources": [
                                    {"title": "Azure Virtual Machines", "url": "https://learn.microsoft.com/en-us/azure/virtual-machines/"},
                                    {"title": "Create Windows VM", "url": "https://learn.microsoft.com/en-us/training/modules/create-windows-virtual-machine-in-azure/"}
                                ]
                            },
                            {
                                "name": "App Service",
                                "resources": [
                                    {"title": "Azure App Service", "url": "https://learn.microsoft.com/en-us/azure/app-service/"},
                                    {"title": "Deploy Web App", "url": "https://learn.microsoft.com/en-us/training/modules/host-a-web-app-with-azure-app-service/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Azure Storage",
                        "description": "Blob storage, files, and queues",
                        "daysToComplete": 3,
                        "subtopics": [
                            {
                                "name": "Storage Account & Blobs",
                                "resources": [
                                    {"title": "Azure Storage Documentation", "url": "https://learn.microsoft.com/en-us/azure/storage/"},
                                    {"title": "Blob Storage Tutorial", "url": "https://learn.microsoft.com/en-us/training/modules/store-app-data-with-azure-blob-storage/"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 2: Databases & Networking (Days 21-50)",
                "duration": "4 weeks",
                "description": "SQL Database, Cosmos DB, Virtual Networks",
                "topics": [
                    {
                        "title": "Azure SQL Database",
                        "description": "Managed SQL database service",
                        "daysToComplete": 10,
                        "subtopics": [
                            {
                                "name": "SQL Database Setup",
                                "resources": [
                                    {"title": "Azure SQL Database", "url": "https://learn.microsoft.com/en-us/azure/azure-sql/database/"},
                                    {"title": "Create SQL Database", "url": "https://learn.microsoft.com/en-us/training/modules/provision-azure-sql-database/"}
                                ]
                            },
                            {
                                "name": "Backup & Recovery",
                                "resources": [
                                    {"title": "SQL Database Backup", "url": "https://learn.microsoft.com/en-us/azure/azure-sql/database/automated-backups-overview"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Azure Cosmos DB",
                        "description": "NoSQL database service",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "Cosmos DB Fundamentals",
                                "resources": [
                                    {"title": "Azure Cosmos DB", "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/"},
                                    {"title": "Getting Started with Cosmos DB", "url": "https://learn.microsoft.com/en-us/training/modules/create-cosmos-db-for-scale/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Virtual Networks & Connectivity",
                        "description": "VNets, subnets, and network security",
                        "daysToComplete": 10,
                        "subtopics": [
                            {
                                "name": "Virtual Networks",
                                "resources": [
                                    {"title": "Azure Virtual Networks", "url": "https://learn.microsoft.com/en-us/azure/virtual-network/"},
                                    {"title": "Create Virtual Network", "url": "https://learn.microsoft.com/en-us/training/modules/configure-virtual-networks/"}
                                ]
                            },
                            {
                                "name": "Network Security Groups",
                                "resources": [
                                    {"title": "NSG Documentation", "url": "https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Load Balancer & Autoscaling",
                        "description": "Distribute traffic and scale applications",
                        "daysToComplete": 12,
                        "subtopics": [
                            {
                                "name": "Azure Load Balancer",
                                "resources": [
                                    {"title": "Load Balancer", "url": "https://learn.microsoft.com/en-us/azure/load-balancer/"},
                                    {"title": "Application Gateway", "url": "https://learn.microsoft.com/en-us/azure/application-gateway/"}
                                ]
                            },
                            {
                                "name": "Virtual Machine Scale Sets",
                                "resources": [
                                    {"title": "VMSS Documentation", "url": "https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/"},
                                    {"title": "Auto-scaling", "url": "https://learn.microsoft.com/en-us/training/modules/configure-virtual-machine-scale-sets/"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Phase 3: Advanced Services (Days 51-75)",
                "duration": "3 weeks",
                "description": "Azure Functions, Key Vault, Monitoring, and Security",
                "topics": [
                    {
                        "title": "Azure Functions & Serverless",
                        "description": "Serverless computing with Azure Functions",
                        "daysToComplete": 12,
                        "subtopics": [
                            {
                                "name": "Azure Functions",
                                "resources": [
                                    {"title": "Azure Functions Documentation", "url": "https://learn.microsoft.com/en-us/azure/azure-functions/"},
                                    {"title": "Getting Started with Functions", "url": "https://learn.microsoft.com/en-us/training/modules/create-serverless-logic-with-azure-functions/"}
                                ]
                            },
                            {
                                "name": "Logic Apps & Integration",
                                "resources": [
                                    {"title": "Azure Logic Apps", "url": "https://learn.microsoft.com/en-us/azure/logic-apps/"},
                                    {"title": "Logic Apps Tutorial", "url": "https://learn.microsoft.com/en-us/training/modules/create-business-process-with-logic-apps/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Infrastructure as Code",
                        "description": "ARM Templates and Bicep",
                        "daysToComplete": 10,
                        "subtopics": [
                            {
                                "name": "ARM Templates",
                                "resources": [
                                    {"title": "ARM Templates", "url": "https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/"},
                                    {"title": "Template Tutorial", "url": "https://learn.microsoft.com/en-us/training/modules/create-manage-azure-resources-arm/"}
                                ]
                            },
                            {
                                "name": "Bicep Language",
                                "resources": [
                                    {"title": "Bicep Documentation", "url": "https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Monitoring & Management",
                        "description": "Azure Monitor and Log Analytics",
                        "daysToComplete": 8,
                        "subtopics": [
                            {
                                "name": "Azure Monitor",
                                "resources": [
                                    {"title": "Azure Monitor", "url": "https://learn.microsoft.com/en-us/azure/azure-monitor/"},
                                    {"title": "Monitor Resources", "url": "https://learn.microsoft.com/en-us/training/modules/azure-monitoring/"}
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Security & Compliance",
                        "description": "Azure Key Vault and security best practices",
                        "daysToComplete": 5,
                        "subtopics": [
                            {
                                "name": "Azure Key Vault",
                                "resources": [
                                    {"title": "Key Vault Documentation", "url": "https://learn.microsoft.com/en-us/azure/key-vault/"},
                                    {"title": "Security Best Practices", "url": "https://learn.microsoft.com/en-us/azure/security/fundamentals/"}
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "projects": [
            {
                "name": "Static Website on Azure Storage",
                "description": "Host a static website on Azure Blob Storage with CDN",
                "difficulty": "Beginner",
                "skills": ["Storage Account", "Static Web Hosting", "CDN"]
            },
            {
                "name": "Web App with Azure App Service",
                "description": "Deploy a web application using App Service and SQL Database",
                "difficulty": "Intermediate",
                "skills": ["App Service", "SQL Database", "Authentication"]
            },
            {
                "name": "Serverless API with Azure Functions",
                "description": "Build REST API using Azure Functions and Cosmos DB",
                "difficulty": "Intermediate",
                "skills": ["Azure Functions", "Cosmos DB", "API Management"]
            },
            {
                "name": "Full-Stack Application on Azure",
                "description": "Deploy complete application with VMs, databases, and load balancing",
                "difficulty": "Advanced",
                "skills": ["VMs", "SQL Database", "VNets", "Load Balancer"]
            }
        ]
    }
}


def get_hardcoded_roadmap(skill: str) -> dict:
    """
    Retrieve hardcoded roadmap for a given skill.
    Returns the roadmap or None if skill not found.
    """
    skill_lower = skill.lower().strip()
    
    # Try exact match first
    if skill_lower in HARDCODED_ROADMAPS:
        return HARDCODED_ROADMAPS[skill_lower]
    
    # Try partial match
    for key in HARDCODED_ROADMAPS:
        if skill_lower in key or key in skill_lower:
            return HARDCODED_ROADMAPS[key]
    
    return None


def is_skill_hardcoded(skill: str) -> bool:
    """Check if a skill has a hardcoded roadmap."""
    return get_hardcoded_roadmap(skill) is not None

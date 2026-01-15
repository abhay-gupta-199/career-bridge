# Detailed Roadmap Response Structure

## API Endpoint
`POST /api/generate-job-roadmap`

## Response Structure

```json
{
  "job": {
    "id": "job_id",
    "title": "Senior React Developer",
    "company": "Tech Company",
    "location": "Remote"
  },
  "student": {
    "id": "student_id",
    "name": "Student Name"
  },
  "matchAnalysis": {
    "matchedSkills": ["JavaScript", "HTML", "CSS"],
    "skillsToLearn": ["Advanced React", "TypeScript", "Node.js"],
    "totalSkillsRequired": 8,
    "matchPercentage": 45
  },
  "timeline": {
    "daysLeft": 30,
    "startDate": "2026-01-15T10:00:00Z",
    "targetDate": "2026-02-14T10:00:00Z"
  },
  "roadmap": {
    "overview": "Comprehensive learning path for React development",
    "totalDays": 30,
    "topics": [
      {
        "title": "Advanced React Patterns",
        "description": "Master advanced React concepts and patterns",
        "daysToComplete": 7,
        "difficulty": "Intermediate",
        "subtopics": [
          {
            "name": "Hooks and Custom Hooks",
            "description": "Deep dive into React Hooks",
            "timeInHours": 8,
            "keyPoints": [
              "useState and useEffect",
              "Custom hook creation",
              "Hook rules and best practices"
            ],
            "practiceExercises": [
              "Build a form with custom validation hook",
              "Create a data fetching custom hook"
            ]
          },
          {
            "name": "State Management",
            "description": "Context API vs Redux",
            "timeInHours": 6,
            "keyPoints": [
              "Context API advanced usage",
              "Redux fundamentals",
              "Redux Thunk middleware"
            ],
            "practiceExercises": [
              "Implement Redux store",
              "Create async middleware"
            ]
          }
        ],
        "resources": [
          {
            "type": "documentation",
            "title": "React Official Docs - Hooks",
            "url": "https://react.dev/reference/react/hooks",
            "difficulty": "Intermediate"
          },
          {
            "type": "course",
            "title": "Advanced React Patterns",
            "url": "https://egghead.io/courses/advanced-react",
            "difficulty": "Advanced"
          },
          {
            "type": "video",
            "title": "React Hooks Complete Guide",
            "url": "https://www.youtube.com/watch?v=...",
            "difficulty": "Intermediate"
          }
        ],
        "project": {
          "title": "Real-time Collaborative Todo App",
          "description": "Build a todo app with real-time updates using React Hooks and Context API",
          "estimatedHours": 12
        }
      },
      {
        "title": "TypeScript for React",
        "description": "Master TypeScript in React applications",
        "daysToComplete": 8,
        "difficulty": "Advanced",
        "subtopics": [
          {
            "name": "TypeScript Basics",
            "description": "Type annotations and interfaces",
            "timeInHours": 6,
            "keyPoints": [
              "Basic types and interfaces",
              "Union and intersection types",
              "Generics fundamentals"
            ],
            "practiceExercises": [
              "Convert JavaScript to TypeScript",
              "Create reusable generic components"
            ]
          }
        ],
        "resources": [
          {
            "type": "documentation",
            "title": "TypeScript Handbook",
            "url": "https://www.typescriptlang.org/docs/",
            "difficulty": "Intermediate"
          }
        ],
        "project": {
          "title": "TypeScript React Component Library",
          "description": "Create a reusable component library with TypeScript",
          "estimatedHours": 15
        }
      }
    ],
    "weeklySchedule": [
      {
        "week": 1,
        "focus": "Advanced React Patterns and Hooks",
        "dailyCommitment": "2 hours per day",
        "goals": [
          "Complete custom hooks tutorial",
          "Implement 2 real projects using hooks",
          "Understand Context API deeply"
        ]
      },
      {
        "week": 2,
        "focus": "State Management and TypeScript Basics",
        "dailyCommitment": "2-3 hours per day",
        "goals": [
          "Learn Redux fundamentals",
          "Set up TypeScript in React project",
          "Begin state management refactoring"
        ]
      }
    ],
    "assessmentMilestones": [
      {
        "milestone": "After Advanced React Patterns",
        "assessment": "Build a complex component with custom hooks and context",
        "targetDate": "Day 7"
      },
      {
        "milestone": "After TypeScript",
        "assessment": "Convert existing project to TypeScript",
        "targetDate": "Day 15"
      }
    ],
    "commonPitfalls": [
      "Not understanding closure in hooks",
      "Overusing context for state management",
      "Incorrect TypeScript typing for React components"
    ],
    "tips": [
      "Practice hooks with small projects first",
      "Build a component library to reinforce learning",
      "Join React communities for support"
    ]
  }
}
```

## Frontend Display Recommendations

### 1. Match Analysis Section
```
┌─────────────────────────────────────┐
│ SKILLS ANALYSIS                     │
├─────────────────────────────────────┤
│ ✅ Matched Skills (3)              │
│  • JavaScript                       │
│  • HTML                             │
│  • CSS                              │
│                                     │
│ 📚 Skills to Learn (3)             │
│  • Advanced React                   │
│  • TypeScript                       │
│  • Node.js                          │
│                                     │
│ Match: 45% | Timeline: 30 days     │
└─────────────────────────────────────┘
```

### 2. Timeline Section
```
Start: Jan 15, 2026
Target: Feb 14, 2026
⏰ 30 Days Available
```

### 3. Roadmap Section
For each topic:
- Title + Description
- Difficulty badge
- Days to complete
- Subtopics (expandable)
  - Each with hours, key points, exercises
- Resources grid (cards with type, title, link)
- Project card with description and estimated hours

### 4. Weekly Schedule
Timeline view showing:
- Week number
- Focus areas
- Daily commitment
- Goals checklist

### 5. Assessment Milestones
Milestone badges showing:
- Milestone name
- Assessment task
- Target date

## Error Handling

If Gemini API fails:
```json
{
  "message": "Roadmap generation unavailable",
  "details": "Gemini API is currently unavailable. Please check your API key and quota.",
  "error": "429 RESOURCE_EXHAUSTED"
}
```

Status Code: `503 Service Unavailable`

## Notes
- All times are in hours/days
- Resources should open in new tabs
- Projects should link to project details
- Assessment milestones should have completion tracking
- Weekly schedule should be editable (future enhancement)

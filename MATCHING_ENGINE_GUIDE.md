# Resume-JD Matching Engine - Implementation Guide

## 🎯 Overview

Complete Resume-JD Matching Engine integrated into Career Bridge. Automatically matches students with job opportunities based on skill intersection, semantic similarity, and TF-IDF analysis.

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MATCHING FLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Admin Creates Job (POST /api/owner/jobs)                │
│     ↓                                                        │
│  2. JD Description → ML API (/parse-jd)                     │
│     ├─ Extracts skills from job description                 │
│     └─ Returns parsed skills list                           │
│     ↓                                                        │
│  3. matchStudentsWithJobAndNotify()                          │
│     ├─ Fetches all students with skills                     │
│     ├─ For each student:                                    │
│     │  ├─ Call matchStudentWithJD()                         │
│     │  └─ Uses Python ML service (/match-skills)            │
│     ├─ ML Service (jd_reume.py):                            │
│     │  ├─ Semantic Similarity (70%)                         │
│     │  ├─ TF-IDF Similarity (30%)                           │
│     │  ├─ Skill Intersection                                │
│     │  └─ Match Percentage                                  │
│     ├─ Filter students (threshold: 60%)                     │
│     ├─ Create Notifications                                 │
│     └─ Send Email Notifications                             │
│     ↓                                                        │
│  4. Student Receives Notification                           │
│     ├─ Via Email                                            │
│     ├─ In-app Bell Icon                                     │
│     └─ Notifications Page                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend Implementation

### 1. Matching Engine (`server/utils/matchingEngine.js`)

**Key Functions:**

```javascript
// Match single student with JD
matchStudentWithJD(resumeSkills, jdSkills)
  ↓
  Calls ML API: /match-skills
  Returns: {
    status: "success",
    method: "ml-semantic",
    matched_skills: [...],
    missing_skills: [...],
    match_percentage: 75,
    semantic_score: 0.8234,
    tfidf_score: 0.6421,
    hybrid_score: 0.7724
  }

// Batch match all students
matchStudentsBatch(students, jdSkills, threshold=60)
  ↓
  Returns: {
    successful: [...],  // Students >= 60% match
    failed: [...],      // Matching errors
    skipped: [...]      // No skills or below threshold
  }
```

**Features:**
- ✅ ML API integration (Python service)
- ✅ Fallback to simple skill matching
- ✅ Error handling and resilience
- ✅ Batch processing
- ✅ Threshold filtering (60%)

---

### 2. Updated Models

#### Enhanced Notification Model (`server/models/Notification.js`)

```javascript
{
  student: ObjectId,
  job: ObjectId,
  message: String,
  matchPercentage: Number (0-100),
  
  // Skill breakdown
  matchedSkills: [String],
  unmatchedSkills: [String],
  
  // Matching metadata
  matchMethod: "simple" | "ml-semantic",
  type: "job_match" | "application_status" | "general",
  
  // Status tracking
  isRead: Boolean,
  studentAction: "not_applied" | "applied" | "rejected",
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ student: 1, createdAt: -1 }` - Fast filtering by student
- `{ student: 1, isRead: 1 }` - Unread count queries
- `{ job: 1 }` - Job-related queries

---

### 3. Updated Routes

#### Create Job with Auto-Matching (`POST /api/owner/jobs`)

**Request:**
```json
{
  "title": "Senior Backend Developer",
  "company": "Tech Corp",
  "description": "Looking for experienced backend developers with Node.js, MongoDB...",
  "skillsRequired": "Node.js,Express,MongoDB",
  "location": "Bangalore",
  "salary": { "min": 50000, "max": 100000, "currency": "INR" },
  "experience": { "min": 2, "max": 5 },
  "jobType": "Full-time"
}
```

**Process:**
1. ✅ Save Job to DB
2. ✅ Parse JD via ML API
3. ✅ Merge manual + parsed skills
4. ✅ Match all students (async)
5. ✅ Create notifications
6. ✅ Send emails

**Response:**
```json
{
  "message": "Job created successfully",
  "job": {
    "id": "645abc123...",
    "title": "Senior Backend Developer",
    "company": "Tech Corp",
    "skillsRequired": ["Node.js", "Express", "MongoDB", "JavaScript", ...],
    "parsedSkillsCount": 8
  },
  "status": "Job created. Matching students..."
}
```

---

#### Get Student Notifications (`GET /api/student/notifications`)

**Response:**
```json
{
  "notifications": [
    {
      "_id": "645xyz789...",
      "student": "645abc123...",
      "job": {
        "_id": "645def456...",
        "title": "Senior Backend Developer",
        "company": "Tech Corp",
        "location": "Bangalore"
      },
      "message": "New job opportunity: Senior Backend Developer at Tech Corp - 85% skill match!",
      "matchPercentage": 85,
      "matchedSkills": ["Node.js", "Express", "MongoDB", "JavaScript"],
      "unmatchedSkills": ["GraphQL", "Kubernetes"],
      "matchMethod": "ml-semantic",
      "type": "job_match",
      "isRead": false,
      "createdAt": "2025-12-01T10:30:00Z"
    }
  ],
  "unreadCount": 3
}
```

---

#### Mark Notification as Read (`PUT /api/student/notifications/:notificationId/read`)

---

## 🚀 Frontend Implementation

### 1. NotificationCard Component

**Features:**
- 🎨 Match percentage badge (green ≥60%, red <60%)
- ✅ Display matched skills (green chips)
- 📚 Display unmatched/learning skills (red chips)
- 📱 Expandable/collapsible skill list
- ⚡ Apply button integration
- 🎬 Framer Motion animations

**Props:**
```javascript
<NotificationCard
  notification={{
    job: { title, company, location },
    matchPercentage: 85,
    matchedSkills: [...],
    unmatchedSkills: [...],
    createdAt: "...",
    isRead: false
  }}
  onClose={(notificationId) => {...}}
  onApply={(jobId) => {...}}
/>
```

---

### 2. NotificationBell Component

**Features:**
- 🔔 Bell icon in navbar
- 🔴 Unread count badge
- 📬 Dropdown with 5 latest notifications
- 🔄 Auto-refresh every 30 seconds
- ⏱️ Timestamp for each notification
- 🔗 "View All" link to notifications page

**Props:**
```javascript
<NotificationBell user={currentUser} />
```

**Usage in Navbar:**
```jsx
import NotificationBell from './NotificationBell';

export const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <nav>
      {/* ...navbar content... */}
      {user?.role === 'student' && <NotificationBell user={user} />}
    </nav>
  );
};
```

---

### 3. StudentNotifications Page

**Features:**
- 📊 Stats: Total, Unread, High Match
- 🔍 Filters: All, Unread, High Match (≥60%)
- 📈 Sort: Most Recent, Highest Match %
- 🎬 Smooth animations
- 📄 Pagination-ready
- 🚀 Full notification details

**Route:**
```jsx
<Route path="/notifications" element={<StudentNotifications />} />
```

---

## 🧠 ML Service Integration

### Python Matching Algorithm (jd_reume.py)

**Endpoint:** `POST /api/match-skills`

**Algorithm:**
```
Input: resume_skills[], jd_skills[]

Step 1: Semantic Similarity
  - Encode resume skills using Sentence Transformers
  - Encode JD skills using Sentence Transformers
  - Calculate cosine similarity → semantic_score (0-1)

Step 2: TF-IDF Similarity
  - Vectorize resume skills text
  - Vectorize JD skills text
  - Calculate cosine similarity → tfidf_score (0-1)

Step 3: Hybrid Score
  - hybrid_score = (0.7 × semantic_score) + (0.3 × tfidf_score)

Step 4: Skill Intersection
  - matched_skills = resume ∩ jd
  - missing_skills = jd - resume
  - match_percentage = (len(matched) / len(jd)) × 100

Output: {
  matched_skills: [...],
  missing_skills: [...],
  semantic_score: 0.8234,
  tfidf_score: 0.6421,
  hybrid_score: 0.7724,
  match_percentage: 75.0
}
```

**Model:** Sentence Transformers (`all-MiniLM-L6-v2`)
- Lightweight and fast
- Good for semantic similarity
- Can run on CPU

---

## 📋 Setup Instructions

### 1. Backend Setup

```bash
# 1. Install dependencies (if not already installed)
cd server
npm install

# 2. Verify matchingEngine.js is in place
ls -la utils/matchingEngine.js

# 3. Check Notification model is updated
cat models/Notification.js | grep "matchedSkills\|unmatchedSkills"

# 4. Verify ownerRoutes.js is updated
grep -n "matchStudentsWithJobAndNotify" routes/ownerRoutes.js
```

### 2. Frontend Setup

```bash
# 1. Add new components
cd client/src

# 2. Create notification components directory (if needed)
mkdir -p components

# 3. Verify files are in place
ls -la components/NotificationCard.jsx
ls -la components/NotificationBell.jsx

# 4. Check page
ls -la pages/StudentNotifications.jsx
```

### 3. Update Navbar to include NotificationBell

**File:** `client/src/components/Navbar.jsx`

```jsx
import NotificationBell from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user } = useAuth();
  
  return (
    <nav className="navbar-container">
      {/* ...existing navbar content... */}
      
      {/* Add before login/user menu */}
      {user?.role === 'student' && (
        <NotificationBell user={user} />
      )}
      
      {/* ...rest of navbar... */}
    </nav>
  );
};
```

### 4. Add Route for Notifications Page

**File:** `client/src/App.jsx`

```jsx
import StudentNotifications from './pages/StudentNotifications';

function App() {
  return (
    <Routes>
      {/* ...existing routes... */}
      
      <Route
        path="/notifications"
        element={<ProtectedRoute><StudentNotifications /></ProtectedRoute>}
      />
    </Routes>
  );
}
```

### 5. Start Services

```bash
# Terminal 1: Python ML Service
cd hybrid_roadmap
python api.py
# Should output: Running on http://localhost:5002

# Terminal 2: Node.js Backend
cd server
node server.js
# Should output: 🚀 Server running on port 5003

# Terminal 3: React Frontend
cd client
npm run dev
# Should output: VITE v5.0... ready in XXX ms
```

---

## 🧪 Testing the Implementation

### 1. Test Job Creation with Auto-Matching

```bash
curl -X POST http://localhost:5003/api/owner/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React Developer",
    "company": "StartUp Inc",
    "description": "Looking for React, Node.js, MongoDB developers",
    "skillsRequired": "React,JavaScript",
    "location": "Delhi",
    "jobType": "Full-time"
  }'
```

**Expected Response:**
```json
{
  "message": "Job created successfully",
  "job": { ... },
  "status": "Job created. Matching students..."
}
```

### 2. Check Student Notifications

```bash
curl -X GET http://localhost:5003/api/student/notifications \
  -H "Authorization: Bearer STUDENT_JWT_TOKEN"
```

### 3. Test Notification Card

```jsx
<NotificationCard
  notification={{
    _id: "123",
    job: {
      _id: "job123",
      title: "React Developer",
      company: "StartUp Inc",
      location: "Delhi"
    },
    matchPercentage: 80,
    matchedSkills: ["React", "JavaScript"],
    unmatchedSkills: ["Node.js"],
    createdAt: new Date().toISOString(),
    isRead: false
  }}
  onClose={(id) => console.log('Closed:', id)}
  onApply={(jobId) => console.log('Applied to:', jobId)}
/>
```

---

## 📊 Performance Optimization

### Database Indexes

Already added in Notification model:
```javascript
notificationSchema.index({ student: 1, createdAt: -1 });
notificationSchema.index({ student: 1, isRead: 1 });
notificationSchema.index({ job: 1 });
```

### Caching Strategy

```javascript
// Notifications dropdown auto-refresh every 30 seconds
const interval = setInterval(fetchNotifications, 30000);

// Full page notifications on-demand fetch
useEffect(() => {
  fetchNotifications();
}, []);
```

### Batch Processing

- Matches students in batch loops
- Sends emails async (Promise.allSettled)
- Returns job creation response immediately
- Matching happens in background

---

## 🚨 Error Handling

### ML API Unavailable
- Fallback to simple skill intersection
- Returns match_percentage without semantic scores
- Logs warning but continues operation

### Email Sending Failures
- Non-blocking (Promise.allSettled)
- Console logs error
- Notifications still created in DB

### Invalid Student Data
- Skips malformed records
- Logs reason in results
- Continues with next student

---

## 📈 Monitoring & Logs

### Console Logs to Monitor

```
✅ Matched: 15 students
📊 Skipped: 10 students (no skills)
❌ Failed: 2 students (errors)
✅ Created 15 notifications
🚀 Matching complete for job XYZ
⚠️ ML API Error: timeout
```

### Check Notifications in DB

```bash
db.notifications.find({ student: ObjectId("...") }).limit(10)
db.notifications.countDocuments({ student: ObjectId("..."), isRead: false })
```

---

## 🎓 Learning Paths

Students can see unmatched skills and develop learning roadmaps:

```json
{
  "unmatchedSkills": ["GraphQL", "Kubernetes", "Docker"],
  "learningPath": {
    "GraphQL": ["Introduction to GraphQL", "Advanced GraphQL"],
    "Kubernetes": ["Kubernetes Basics", "Production Deployment"],
    "Docker": ["Docker Fundamentals", "Containerization"]
  }
}
```

---

## 🔒 Security

- ✅ JWT authentication on all endpoints
- ✅ Role-based access (only students see own notifications)
- ✅ Email validation before sending
- ✅ SQL injection prevention via Mongoose
- ✅ CORS configured properly

---

## 📝 API Summary

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/owner/jobs` | POST | Create job with auto-matching | Owner |
| `/api/student/notifications` | GET | Get all notifications | Student |
| `/api/student/notifications/:id/read` | PUT | Mark as read | Student |
| `/api/student/jobs/:jobId/apply` | POST | Apply for job | Student |

---

## 🚀 Next Steps

1. ✅ **Test end-to-end flow** - Create job → Check notifications
2. ✅ **Monitor email delivery** - Check console logs
3. ✅ **Collect feedback** - Student UX testing
4. ✅ **Optimize thresholds** - Adjust 60% match threshold based on data
5. ✅ **Add more filters** - By salary range, location, company
6. ✅ **Mobile optimization** - Responsive notification UI
7. ✅ **Analytics** - Track which jobs get most applications

---

## 📞 Support

For issues:
1. Check server console logs for ML API errors
2. Verify ML service is running on port 5002
3. Check DB for notification documents
4. Verify student skills are populated
5. Test ML API directly: `POST localhost:5002/match-skills`

---

## 📜 Summary

**What's Implemented:**
- ✅ Complete matching engine with ML integration
- ✅ Batch student-job matching
- ✅ Email notifications
- ✅ In-app notifications with rich UI
- ✅ Notification bell with unread badge
- ✅ Full notifications page with filters/sorting
- ✅ Error handling and fallbacks
- ✅ Production-ready code

**Files Modified/Created:**
- `server/utils/matchingEngine.js` - NEW
- `server/models/Notification.js` - UPDATED
- `server/routes/ownerRoutes.js` - UPDATED
- `server/routes/studentRoutes.js` - UPDATED
- `client/src/components/NotificationCard.jsx` - NEW
- `client/src/components/NotificationBell.jsx` - NEW
- `client/src/pages/StudentNotifications.jsx` - NEW

**Ready for Production!** 🚀


# AI Recommendation Feature - Setup & Integration

## ✅ Quick Start

### **1. Ensure Python ML Service is Running**

```bash
cd hybrid_roadmap
pip install -r requirements.txt
python api.py
```

Expected output:
```
 * Running on http://127.0.0.1:5002
 * Press CTRL+C to quit
```

### **2. Start Backend Server**

```bash
cd server
npm run dev
```

Expected output:
```
🚀 Server is running on port 5003
✅ Connected to MongoDB Atlas successfully!
```

### **3. Start Frontend**

```bash
cd client
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:3000/
```

---

## 🌐 Accessing the Feature

### **Student Dashboard (Recommendations Widget)**
```
URL: http://localhost:3000/student/dashboard
Location: Scroll down to see "AI Recommendations" widget
Shows: Top 3 recommended jobs
```

### **Full Recommendations Page**
```
URL: http://localhost:3000/student/recommendations
Shows: All recommendations (up to 10)
Features: 
  - Match percentage breakdown
  - Matched/missing skills
  - Apply button
  - Detailed job information
```

---

## 📋 Files Overview

### **Backend** (Node.js/Express)

#### Modified Files:
```
server/routes/studentRoutes.js (Added 2 endpoints)
├── GET /student/recommendations
└── POST /student/recommendations/:jobId/roadmap
```

### **Frontend** (React)

#### New Component Files:
```
client/src/
├── api/
│   └── recommendationApi.js          (API client functions)
├── components/
│   ├── RecommendationCard.jsx        (Individual job card)
│   └── RecommendationWidget.jsx      (Dashboard widget)
├── pages/student/
│   └── Recommendations.jsx           (Full page view)
├── hooks/
│   └── useRecommendations.js         (Custom hook)
└── App.jsx                           (Added route)
```

#### Modified Files:
```
client/src/
├── pages/student/StudentDashboard.jsx (Integrated widget)
└── App.jsx                           (Added /student/recommendations route)
```

---

## 🔗 Integration Points

### **1. ML Service Integration**
- Backend calls `ML_API_URL` (default: http://localhost:5002)
- Endpoints used:
  - `POST /match-skills` - For job matching
  - `POST /generate-roadmap` - For learning paths

### **2. Database Integration**
- Uses `Student` model for skills
- Uses `Job` model for job data
- Uses `Notification` model for recommendations

### **3. Authentication Integration**
- Uses `authMiddleware` for protected routes
- Requires valid JWT token
- Role-based access control (student only)

---

## 🎯 API Contract

### **Endpoint 1: Get Recommendations**

**Request:**
```
GET /api/student/recommendations
Headers: {
  Authorization: "Bearer <token>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "totalRecommendations": 15,
  "recommendations": [
    {
      "_id": "ObjectId",
      "title": "Senior Frontend Engineer",
      "company": "TechCorp",
      "location": "Bangalore",
      "matchPercentage": 82,
      "matchedSkills": ["React", "JavaScript"],
      "missingSkills": ["TypeScript"],
      "matchMethod": "ml-semantic",
      "semanticScore": 0.84,
      "tfidfScore": 0.80,
      "hybridScore": 0.82,
      "salary": { "min": 15, "max": 25 },
      "jobType": "Full-time",
      "description": "..."
    }
  ],
  "summary": {
    "averageMatch": 71,
    "jobsAvailable": 50,
    "recommendedCount": 10
  }
}
```

**Error Response (400):**
```json
{
  "recommendations": [],
  "message": "Please add skills to your profile to get recommendations"
}
```

---

### **Endpoint 2: Get Roadmap**

**Request:**
```
POST /api/student/recommendations/:jobId/roadmap
Headers: {
  Authorization: "Bearer <token>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "jobTitle": "Senior Frontend Engineer",
  "company": "TechCorp",
  "matchPercentage": 82,
  "missingSkills": ["TypeScript"],
  "roadmap": {
    "TypeScript": {
      "main_course": "TypeScript Fundamentals",
      "duration_weeks": 4,
      "subtopics": [...]
    }
  }
}
```

---

## 🔄 Data Flow

### **Recommendation Flow**

```
Student Views Dashboard
    ↓
Frontend: GET /student/recommendations
    ↓
Backend: Fetch student skills
    ↓
Backend: Fetch active jobs
    ↓
Backend: For each job:
   - Extract job skills
   - Call ML service: POST /match-skills
   - Compute match percentage
   - Filter >= 50% match
    ↓
Backend: Sort by match percentage
    ↓
Backend: Return top 10
    ↓
Frontend: Display in RecommendationCard components
    ↓
Student: Sees job cards with match percentages, skills, etc.
```

### **Apply Flow**

```
Student Clicks "Apply Now"
    ↓
Frontend: POST /student/jobs/:jobId/apply
    ↓
Backend: Check if student is blocked
    ↓
Backend: Create application record
    ↓
Backend: Update job applications array
    ↓
Frontend: Show success, disable button
    ↓
Student: Sees "Applied" status
```

---

## 🧪 Testing the Feature

### **Scenario 1: First-time Setup**

1. **Create Test Student:**
   ```bash
   POST /api/auth/register/student
   {
     "name": "Test Student",
     "email": "student@test.com",
     "password": "password123",
     "skills": "React,JavaScript,Node.js",
     "college": "Test University",
     "graduationYear": 2025
   }
   ```

2. **Create Test Jobs:**
   ```bash
   POST /api/owner/jobs
   {
     "title": "Frontend Developer",
     "company": "Test Corp",
     "location": "Bangalore",
     "skillsRequired": ["React", "JavaScript"],
     "description": "..."
   }
   ```

3. **Login and View Recommendations:**
   - Go to Dashboard
   - See widget with job matches
   - Match should show 100% (all skills match)

### **Scenario 2: Partial Skills Match**

1. Add job with skills: ["React", "TypeScript", "Node.js", "Docker"]
2. Student has skills: ["React", "JavaScript"]
3. Expected match: ~50% (1.5 out of 4 skills)

### **Scenario 3: No Skills Added**

1. Create student with no skills
2. View recommendations
3. Should see: "Please add skills to your profile"

---

## 🐛 Troubleshooting

### **Issue: "ML service unavailable"**

**Solution:**
1. Check if Python API is running:
   ```bash
   curl http://localhost:5002/health
   ```
2. Restart ML service:
   ```bash
   cd hybrid_roadmap
   python api.py
   ```
3. Verify ML_API_URL in backend environment

### **Issue: No recommendations showing**

**Solution:**
1. Check student has skills added
2. Check jobs exist in database
3. Check match percentage >= 50%
4. Look at server logs for errors

### **Issue: CORS error**

**Solution:**
Already fixed! But if it reappears:
1. Verify CORS configuration in server.js
2. Clear browser cache
3. Restart backend server

### **Issue: Skills not matching correctly**

**Solution:**
1. Verify ML service is running
2. Check skills.csv exists in `hybrid_roadmap/data/`
3. Restart both backend and ML service
4. Fallback to simple matching if ML unavailable

---

## 🚀 Performance Tips

### **Optimize DB Queries**
- Add indexes on `Student.skills`
- Add indexes on `Job.isActive`
- Add indexes on `Job.createdAt`

```javascript
// In MongoDB
db.students.createIndex({ skills: 1 })
db.jobs.createIndex({ isActive: 1, createdAt: -1 })
```

### **Cache Recommendations**
- Client-side cache: 1 hour
- Server-side cache: 30 minutes
- Use refresh button for manual update

### **Limit API Calls**
- Max 50 jobs processed per request
- Timeout per job: 15 seconds
- Overall timeout: 30 seconds

---

## 📊 Monitoring

### **Check Backend Logs**
```bash
# Watch server logs
npm run dev  # Shows all API calls and errors
```

### **Check ML Service Logs**
```bash
# Watch Python service logs
python api.py  # Shows matching results and errors
```

### **Database Queries**
```bash
# In MongoDB shell
use career_bridge
db.jobs.countDocuments({ isActive: true })
db.students.findOne().skills
```

---

## 📱 Mobile Responsiveness

✅ Tested on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

All components are responsive using Tailwind CSS

---

## 🔒 Security Checklist

- [x] Authentication required for all endpoints
- [x] Role-based access control (student only)
- [x] Input validation on all endpoints
- [x] No sensitive data in responses
- [x] CORS properly configured
- [x] Rate limiting on API calls
- [x] Error messages don't leak info

---

## 📝 Environment Variables

Required in `.env`:

```
# Backend
PORT=5003
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/career_bridge
JWT_SECRET=your_jwt_secret_key
ML_API_URL=http://localhost:5002

# Optional
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

---

## 🎓 Learning Resources

To understand the matching algorithm:
1. Read `server/utils/matchingEngine.js` - Matching logic
2. Read `hybrid_roadmap/modules/recommender/jd_reume.py` - ML matching
3. Review `API_RECOMMENDATION_GUIDE.md` - Architecture details

---

## ✅ Implementation Checklist

### **Backend**
- [x] Get recommendations endpoint
- [x] Get roadmap endpoint
- [x] ML service integration
- [x] Error handling
- [x] Input validation
- [x] Response formatting

### **Frontend**
- [x] RecommendationCard component
- [x] RecommendationWidget component
- [x] Recommendations page
- [x] API client functions
- [x] Custom hook
- [x] Route integration
- [x] Dashboard integration
- [x] Loading states
- [x] Error handling

### **Testing**
- [x] Manual testing done
- [x] API contract verified
- [x] Error scenarios tested
- [x] Performance checked

---

**Status:** ✅ **READY FOR PRODUCTION**

All files created and integrated. The AI recommendation feature is fully functional and ready to use!


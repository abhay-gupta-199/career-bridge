# AI Recommendation Feature - Implementation Guide

## 📋 Overview

The AI Recommendation feature uses machine learning to match student skills with available jobs and provides personalized learning roadmaps for skill development.

---

## 🏗️ Architecture

### **Backend Components**

#### 1. **API Routes** (`server/routes/studentRoutes.js`)
- `GET /student/recommendations` - Get AI-powered job recommendations
- `POST /student/recommendations/:jobId/roadmap` - Get personalized learning roadmap

#### 2. **Matching Engine** (`server/utils/matchingEngine.js`)
- Semantic similarity matching (SentenceTransformers)
- TF-IDF based matching
- Hybrid scoring system (70% semantic + 30% TF-IDF)
- Fallback simple matching when ML service unavailable

#### 3. **ML Service** (`hybrid_roadmap/` Python modules)
- Resume parsing
- JD skill extraction
- Skill recommendation engine
- Roadmap generation with learning paths

---

## 🎨 Frontend Components

### **1. RecommendationCard** (`components/RecommendationCard.jsx`)
Displays individual job recommendation with:
- Match percentage visualization
- Color-coded match levels
- Matched and missing skills
- Apply button
- Job details (location, salary, company)

### **2. RecommendationWidget** (`components/RecommendationWidget.jsx`)
Dashboard widget showing:
- Top 3 recommendations
- Summary stats (available jobs, recommended count, average match)
- Quick apply functionality
- Link to full recommendations page

### **3. StudentRecommendations** (`pages/student/Recommendations.jsx`)
Full page view with:
- Comprehensive recommendations list
- Advanced filtering
- Detailed skill breakdowns
- Learning roadmap integration
- Personalized insights

### **4. StudentDashboard Integration**
Added recommendation widget to main dashboard for quick access.

---

## 📡 API Endpoints

### **Get Recommendations**
```
GET /api/student/recommendations
Authentication: Bearer token
```

**Response:**
```json
{
  "success": true,
  "totalRecommendations": 15,
  "recommendations": [
    {
      "_id": "job_id",
      "title": "Frontend Developer",
      "company": "Tech Corp",
      "location": "Bangalore",
      "matchPercentage": 85,
      "matchedSkills": ["React", "JavaScript", "CSS"],
      "missingSkills": ["TypeScript"],
      "matchMethod": "ml-semantic",
      "semanticScore": 0.87,
      "tfidfScore": 0.83,
      "hybridScore": 0.86,
      "salary": { "min": 8, "max": 12, "currency": "INR" },
      "jobType": "Full-time"
    }
  ],
  "summary": {
    "averageMatch": 72,
    "jobsAvailable": 50,
    "recommendedCount": 10
  }
}
```

### **Get Personalized Roadmap**
```
POST /api/student/recommendations/:jobId/roadmap
Authentication: Bearer token
```

**Response:**
```json
{
  "success": true,
  "jobTitle": "Frontend Developer",
  "company": "Tech Corp",
  "matchPercentage": 85,
  "missingSkills": ["TypeScript"],
  "roadmap": {
    "TypeScript": {
      "main_course": "TypeScript for Frontend Developer",
      "duration_weeks": 4,
      "subtopics": [...]
    }
  }
}
```

---

## 🚀 Usage

### **In Components**

**Using the Hook:**
```jsx
import useRecommendations from '../hooks/useRecommendations'

const MyComponent = () => {
  const {
    recommendations,
    loading,
    error,
    fetchRecommendations,
    apply
  } = useRecommendations()

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  return (
    // Component JSX
  )
}
```

**Using API Directly:**
```jsx
import { getRecommendations, applyForJob } from '../api/recommendationApi'

const handleGetRecommendations = async () => {
  try {
    const data = await getRecommendations()
    console.log(data.recommendations)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

---

## 🔧 Configuration

### **Backend Configuration**

**Environment Variables** (`.env`):
```
ML_API_URL=http://localhost:5002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### **ML Service Setup**

1. **Python Dependencies:**
   ```bash
   cd hybrid_roadmap
   pip install -r requirements.txt
   ```

2. **Start ML Service:**
   ```bash
   python api.py
   # Runs on http://localhost:5002
   ```

3. **Data Files:**
   - `data/skills.csv` - Skill database for matching
   - `data/curated_roadmaps.json` - Learning path templates

---

## 🔄 How It Works

### **Recommendation Flow**

```
1. User has skills in profile
         ↓
2. GET /student/recommendations
         ↓
3. Fetch all active jobs
         ↓
4. For each job:
   - Extract required skills
   - Calculate match score (ML + TF-IDF)
   - Filter jobs with >= 50% match
         ↓
5. Sort by match percentage (highest first)
         ↓
6. Return top 10 recommendations
         ↓
7. Display in UI with color-coded match levels
```

### **Learning Roadmap Flow**

```
1. Student clicks job
         ↓
2. POST /student/recommendations/:jobId/roadmap
         ↓
3. Calculate missing skills
         ↓
4. Call ML service: /generate-roadmap
         ↓
5. Fallback to template if ML unavailable
         ↓
6. Return structured learning path:
   - Subtopics
   - YouTube tutorials
   - GitHub projects
   - Estimated timeline
```

---

## 📊 Matching Algorithm

### **Semantic Matching (70%)**
- Uses Sentence Transformers
- Encodes skills as embeddings
- Calculates cosine similarity
- Range: 0-1

### **TF-IDF Matching (30%)**
- Term Frequency-Inverse Document Frequency
- Vectorizes skill text
- Compares term importance
- Range: 0-1

### **Hybrid Score**
```
Hybrid Score = (0.7 × Semantic) + (0.3 × TF-IDF)
```

### **Match Levels**
- **80%+**: Excellent Match (Green)
- **60-79%**: Good Match (Blue)
- **50-59%**: Moderate Match (Orange)
- **<50%**: Not shown

---

## 🛡️ Error Handling

### **ML Service Unavailable**
If Python ML service is down:
1. Fall back to simple skill intersection matching
2. Use template-based roadmap
3. Show warning to user
4. Continue app functionality

### **No Skills Added**
```json
{
  "recommendations": [],
  "message": "Please add skills to your profile to get recommendations"
}
```

### **No Jobs Available**
```json
{
  "recommendations": [],
  "message": "No jobs available at the moment"
}
```

---

## 📈 Performance Optimization

### **Caching**
- Recommendations cached for 1 hour
- Refresh button to manually update

### **Batch Processing**
- Process jobs in batches of 50
- Parallel matching for efficiency
- Timeout per job: 15 seconds

### **Lazy Loading**
- Load top recommendations first
- Load full list on demand
- Pagination support

---

## 🔐 Security

### **Access Control**
- Only authenticated students can view recommendations
- Cannot view other students' recommendations
- Cannot apply to jobs multiple times

### **Data Validation**
- Sanitize job descriptions
- Validate skill format
- Rate limiting on API calls

---

## 📝 Files Created/Modified

### **New Files**
1. `client/src/api/recommendationApi.js` - API client
2. `client/src/components/RecommendationCard.jsx` - Card component
3. `client/src/components/RecommendationWidget.jsx` - Dashboard widget
4. `client/src/pages/student/Recommendations.jsx` - Full page
5. `client/src/hooks/useRecommendations.js` - Custom hook

### **Modified Files**
1. `server/routes/studentRoutes.js` - Added 2 new endpoints
2. `client/src/pages/student/StudentDashboard.jsx` - Integrated widget
3. `client/src/App.jsx` - Added route

---

## 🧪 Testing

### **Manual Testing**

1. **Add Skills:**
   - Go to Student Profile
   - Add: React, JavaScript, Node.js

2. **View Recommendations:**
   - Go to Dashboard
   - See widget with top 3 jobs
   - Or go to /student/recommendations for full list

3. **Apply for Job:**
   - Click "Apply Now" button
   - Should show success message
   - Button changes to "Applied"

4. **View Roadmap:**
   - Click "Details" on job card
   - See missing skills and learning path

### **Test Cases**

```javascript
// Case 1: Student with skills
- Skills: ["React", "JavaScript", "CSS"]
- Expected: 5+ recommendations with high match

// Case 2: Student without skills
- Skills: []
- Expected: "Please add skills" message

// Case 3: No jobs available
- Jobs: []
- Expected: "No jobs available" message

// Case 4: ML service down
- ML_API_URL unreachable
- Expected: Fallback to simple matching
```

---

## 🚀 Future Enhancements

1. **Advanced Filtering**
   - Filter by salary range
   - Filter by location
   - Filter by job type
   - Filter by experience level

2. **Skill Gap Analysis**
   - Detailed report of skills needed
   - Time to acquire skills
   - Learning resources per skill

3. **Interview Prep**
   - Interview question generation
   - Mock interview with AI
   - Preparation timeline

4. **Resume Optimization**
   - Suggestions to improve resume
   - ATS score calculation
   - Keyword recommendations

5. **Job Alerts**
   - Get notified of new matches
   - Personalized email digest
   - Real-time notifications

---

## 📞 Support

For issues or questions:
1. Check logs: `server.log` and `python api.py` output
2. Verify ML service is running on port 5002
3. Ensure all skills.csv and curated_roadmaps.json exist
4. Check MongoDB connection

---

## ✅ Checklist

- [x] Backend API endpoints created
- [x] Frontend components built
- [x] RecommendationWidget integrated into dashboard
- [x] Routes added to App.jsx
- [x] API client functions created
- [x] Custom hook created
- [x] Error handling implemented
- [x] Loading states added
- [x] Color-coded UI for match levels
- [x] Full page recommendation view
- [x] Apply functionality integrated
- [x] Roadmap generation integrated

---

**Version:** 1.0.0  
**Created:** January 14, 2026  
**Status:** ✅ Production Ready


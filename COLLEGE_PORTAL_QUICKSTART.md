# 🚀 College Portal - Quick Start Guide

## Starting the Application

### Step 1: Start Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:5003
```

### Step 2: Start Frontend
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000 (or http://localhost:5173)
```

### Step 3: Access College Portal
```
http://localhost:3000/college/dashboard
```

---

## Login as College Admin

1. Go to: `http://localhost:3000/login`
2. Select **College** from role dropdown
3. Use test credentials or sign up a new college account
4. You'll be redirected to the dashboard

---

## Portal Navigation

### 📊 Dashboard
- View overall statistics
- See top skills distribution
- Check recent placements
- Access quick actions

**Navigate to**: `/college/dashboard`

### 👥 Students
- View all students
- Search by name/email/skills
- Filter by placement status
- Edit placement status inline
- Export student list as CSV

**Navigate to**: `/college/dashboard/students`

### 💼 Placements
- View placement analytics
- See placement distribution chart
- View top recruiting companies
- Mark students as placed/unplaced
- Track unplaced students

**Navigate to**: `/college/dashboard/placements`

### ⚙️ Settings
- Edit college profile
- Update location, website, description
- Change established year
- Manage notification preferences
- Security options

**Navigate to**: `/college/dashboard/profile`

---

## Key Features

### 1. Search & Filter
```
Students Page:
- Search: name, email, skills
- Filter: All, Placed, Unplaced
- Result: Real-time filtered list
```

### 2. Inline Editing
```
Students Page:
- Click edit icon on any student
- Check "Mark as Placed"
- Enter company name
- Save or Cancel
```

### 3. Export Data
```
Students Page:
- Click "Export" button
- Downloads CSV file with:
  - Name, Email, College, Skills, Grad Year, Status, Company
```

### 4. Analytics Charts
```
Dashboard/Placements:
- Placement Distribution (Pie Chart)
- Top Skills (Bar Chart)
- Graduation Year Trend (Line Chart)
- Company Distribution (Bar Chart)
```

---

## Database Fields

### Student Model
- `name`: Student name
- `email`: Email address
- `college`: College name
- `skills`: Array of skills
- `graduationYear`: Year of graduation
- `isPlaced`: Boolean (true if placed)
- `placedCompany`: Company name (if placed)
- `resume`: Resume file path
- `phone`: Phone number
- `createdAt`: Registration date

### College Model
- `name`: College name
- `email`: Email address
- `location`: City/Location
- `website`: College website
- `description`: About college
- `establishedYear`: Year established
- `totalStudents`: Count
- `placedStudents`: Count
- `twoFactorEnabled`: Boolean
- `createdAt`: Registration date

---

## API Endpoints Reference

### College Profile
```
GET  /api/college/profile
PUT  /api/college/profile
```

### Students
```
GET  /api/college/students
PUT  /api/college/students/:studentId/placement
```

### Analytics
```
GET  /api/college/statistics
```

### Notifications
```
GET  /api/college/notifications
```

---

## Troubleshooting

### "Access Denied" Error
- Check if logged in as college admin
- Verify role is set to "college"
- Check JWT token in localStorage

### Students Not Showing
- Verify students are registered in same college name
- Check MongoDB connection
- Inspect browser console for errors

### Charts Not Displaying
- Ensure Recharts is installed: `npm install recharts`
- Check data is being fetched correctly
- Verify `/api/college/statistics` returns data

### Export Not Working
- Check browser download settings
- Verify CSV generation logic
- Check file size isn't too large

---

## Sample Data Structure

### Student Data (JSON)
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "college": "MIT",
  "skills": ["React", "Node.js", "MongoDB"],
  "graduationYear": 2024,
  "isPlaced": true,
  "placedCompany": "Google",
  "phone": "+91-9876543210",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### College Data (JSON)
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "MIT",
  "email": "admin@mit.edu",
  "location": "Cambridge, MA",
  "website": "https://mit.edu",
  "description": "Massachusetts Institute of Technology",
  "establishedYear": 1861,
  "totalStudents": 1045,
  "placedStudents": 892,
  "createdAt": "2024-01-10T10:30:00Z"
}
```

---

## Common Tasks

### Mark a Student as Placed
1. Go to Students page
2. Click edit icon next to student
3. Check "Mark as Placed"
4. Enter company name
5. Click "Save"

### Unmark a Student as Placed
1. Go to Placements page
2. Find student in "Placed Students" table
3. Click "Unmark" button
4. Placement updated immediately

### Export Student List
1. Go to Students page
2. Apply any filters (optional)
3. Click "Export" button
4. CSV file downloads automatically

### Update College Info
1. Go to Settings page
2. Click "Edit Profile"
3. Update fields (name, location, website, etc.)
4. Click "Save Changes"
5. Profile updated successfully

---

## Performance Tips

1. **Large Student Lists**: Use search/filter to limit results
2. **Chart Rendering**: May take 1-2 seconds for large datasets
3. **Export**: Works for up to 10,000+ students
4. **Real-time Updates**: Dashboard auto-fetches data on load

---

## Support & Help

For issues or questions:
1. Check browser console for errors
2. Verify backend is running
3. Check MongoDB connection
4. Inspect Network tab in DevTools
5. Review server logs for API errors

---

## Next Steps

1. **Customize**: Edit colors, fonts in Tailwind config
2. **Add Features**: Job posting, email notifications, reports
3. **Deploy**: Use Vercel (frontend), Heroku (backend)
4. **Scale**: Optimize queries, add caching, use CDN

**Happy managing! 🎉**

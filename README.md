# Career Bridge

A comprehensive MERN stack web application that bridges the gap between students, colleges, and careers. This platform provides tools for students to find jobs, colleges to track placements, and administrators to manage the entire ecosystem.

## 🚀 Features

### For Students
- **Job Recommendations**: Personalized job suggestions based on skills and preferences
- **Career Roadmaps**: Structured learning paths for Frontend, Backend, and Data Science
- **Resume Tracking**: Upload and manage resume links
- **Application Management**: Track job applications and their status
- **Profile Management**: Complete profile with skills, college, and graduation year

### For Colleges
- **Student Management**: View and manage student records
- **Placement Statistics**: Visual analytics with charts and graphs
- **Skills Analytics**: Track popular skills among students
- **Placement Tracking**: Mark students as placed/unplaced with company details

### For Administrators
- **Job Management**: Full CRUD operations for job postings
- **User Management**: View all students and colleges
- **Platform Analytics**: Overview of total users, jobs, and activity
- **System Notifications**: Broadcast messages to all users

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization library
- **Framer Motion** - Animation library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

### Development Tools
- **Concurrently** - Run multiple commands simultaneously
- **Nodemon** - Auto-restart server during development

## 📁 Project Structure

```
career-bridge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Server entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-bridge
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   npm run install-server
   
   # Install client dependencies
   npm run install-client
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/career-bridge
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using a local instance:
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   # Start both client and server
   npm run dev
   
   # Or start them separately
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage

### Creating Accounts

1. **Student Account**
   - Visit the signup page
   - Select "Student" as account type
   - Fill in personal details, skills, resume link, and college information

2. **College Account**
   - Select "College" as account type
   - Provide college details including location, website, and description

3. **Administrator Account**
   - Select "Administrator" as account type
   - Provide basic admin details

### Dashboard Features

#### Student Dashboard
- View personalized job recommendations
- Apply for jobs with one click
- Track application status
- Access career roadmaps
- Manage profile and skills

#### College Dashboard
- View all students from your college
- Track placement statistics with visual charts
- Update student placement status
- Analyze skills distribution

#### Admin Dashboard
- Create, edit, and delete job postings
- View all users and their details
- Monitor platform statistics
- Manage system-wide notifications

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register/student` - Student registration
- `POST /api/auth/register/college` - College registration
- `POST /api/auth/register/owner` - Admin registration
- `POST /api/auth/login` - User login

### Student Routes
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `GET /api/student/jobs` - Get available jobs
- `POST /api/student/jobs/:id/apply` - Apply for job
- `GET /api/student/applications` - Get job applications

### College Routes
- `GET /api/college/profile` - Get college profile
- `PUT /api/college/profile` - Update college profile
- `GET /api/college/students` - Get college students
- `GET /api/college/statistics` - Get placement statistics
- `PUT /api/college/students/:id/placement` - Update placement status

### Owner Routes
- `GET /api/owner/dashboard` - Get dashboard statistics
- `GET /api/owner/jobs` - Get all jobs
- `POST /api/owner/jobs` - Create new job
- `PUT /api/owner/jobs/:id` - Update job
- `DELETE /api/owner/jobs/:id` - Delete job
- `GET /api/owner/students` - Get all students
- `GET /api/owner/colleges` - Get all colleges

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with white and blue theme
- **Interactive Charts**: Data visualization using Recharts
- **Smooth Animations**: Subtle animations with Framer Motion
- **Intuitive Navigation**: Easy-to-use sidebar and top navigation
- **Real-time Updates**: Live data updates without page refresh

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Access**: Different dashboards for different user types
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing configuration

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Update the `MONGODB_URI` in your environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Set production environment variables

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Update API endpoints to point to your production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed description
3. Contact the development team

## 🔮 Future Enhancements

- AI-powered job recommendations
- Video interview scheduling
- Resume builder with templates
- Company profiles and reviews
- Advanced analytics and reporting
- Mobile app development
- Real-time chat system
- Email notifications
- Advanced search and filtering

---

**Career Bridge** - Bridging the gap between students, colleges, and careers! 🎓💼

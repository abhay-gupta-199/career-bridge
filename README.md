# Career Bridge - Platform Overview & Flow

Career Bridge is a comprehensive platform built to connect Students, Colleges, and Employers (managed by Admins). Below is a simple, easy-to-understand guide on how the website works, the full user flow, and the underlying logic/code structure.

---

## 🌊 Full User Flow

### 1. The Beginning (Landing Page & Auth)
- **Landing Page**: Users arrive at the site to learn about what Career Bridge offers.
- **Signup/Login**: Users can sign up in three different roles:
  - **Student**: Enters personal details, selects their college, adds skills manually, or **uploads a resume**. When a resume is uploaded, our AI automatically reads it and extracts their skills.
  - **College**: Registers to track their students' placement records.
  - **Administrator (Owner)**: Registers to manage the whole platform, create jobs, and oversee colleges and students.

### 2. Student Flow
- **Dashboard**: Students land on a personalized dashboard.
- **Job Recommendations**: Based on their skills and profile, the system suggests the best matching jobs using an AI matching algorithm.
- **Career Roadmaps**: Students can explore structured paths to learn Frontend, Backend, or Data Science.
- **Applying**: Students browse jobs, click apply, and track whether their application is pending, accepted, or rejected.
- **Notifications**: They receive automatic alerts when a new job perfectly matches their skill set.

### 3. College Flow
- **Dashboard**: College representatives log in to see all students registered under their institution.
- **Tracking Placements**: They view visual charts and graphs showing how many students are placed vs. unplaced.
- **Updating Status**: Colleges can manually mark a student as "Placed" and enter the company details.
- **Skill Analytics**: They can see which skills are most popular among their students.

### 4. Administrator Flow
- **Dashboard**: Admins oversee everything.
- **Job Creation**: Admins post new jobs. When they paste a Job Description (JD), the AI automatically extracts the required skills.
- **Auto-Matching**: As soon as a job is created, the system finds students with matching skills and notifies them.
- **Management**: Admins can view and manage all students and colleges on the platform.

---

## 🧩 What Part of the Code is Doing What?

The project is divided into three main folders: **Client (Frontend)**, **Server (Backend)**, and **ML (Artificial Intelligence)**.

### 1. `client/` (Frontend - What the user sees)
*Built with React, Vite, and Tailwind CSS.*
- **`src/pages/`**: Contains the screens you see (e.g., `LandingPage.jsx`, `Signup.jsx`, `Jobs.jsx`, and folders for `student`, `college`, and `admin` dashboards).
- **`src/components/`**: Reusable UI pieces like buttons, forms, and charts.
- **`src/contexts/`**: Manages global state (like remembering who is logged in).

### 2. `server/` (Backend - The brain and database interactions)
*Built with Node.js, Express, and MongoDB.*
- **`routes/`**: Handles requests from the frontend.
  - `authRoutes.js`: Handles login/signup.
  - `studentRoutes.js` / `collegeRoutes.js` / `ownerRoutes.js`: Handles data for each specific user type.
  - `roadmapRoutes.js`: Provides learning paths.
  - `skillExtractionRoutes.js` & `hybridMatchingRoutes.js`: Connects to the ML server to process resumes and match jobs.
- **`models/`**: Defines how data is structured in the MongoDB database (e.g., Student, Job, College schemas).

### 3. `hybrid_roadmap/` & `model_ml/` (AI & Machine Learning)
*Built with Python and Flask.*
- Runs a separate server (`api.py`) that uses Natural Language Processing (`sentence-transformers`, `PyPDF2`).
- **Resume Parsing**: Reads PDF/DOCX resumes to find keywords.
- **Job Matching**: Compares student skills with job descriptions to calculate a "match score".

---

## 🛠️ Technology Stack & Logic Implementation

### What is being used?
- **MERN Stack**: MongoDB (Database), Express.js (Backend API), React.js (Frontend), Node.js (Server runtime).
- **Python & ML Libraries**: Flask (API), scikit-learn, and sentence-transformers for AI logic.
- **Tailwind CSS**: For clean, responsive styling.
- **JWT (JSON Web Tokens)**: For secure login and session tracking.

### How is the logic implemented?
1. **Frontend-Backend Communication**: When a user clicks a button in React (e.g., "Apply to Job"), React uses `axios` to send an HTTP request to the Node.js Server.
2. **Database Queries**: The Node.js server receives the request, checks if the user is authorized (via JWT), and uses `Mongoose` to save or fetch data from MongoDB.
3. **AI Integration via Microservices**: 
   - When complex text needs processing (like a Resume upload), Node.js sends the file to the Python Flask server.
   - The Python server reads the text, extracts skills using its AI models, and sends the extracted skills back to Node.js.
   - Node.js then saves these skills into the student's MongoDB profile.
4. **Real-Time Data**: Dashboards use `Recharts` to instantly render the database numbers (like placement stats) into beautiful visual graphs.

---

This architecture ensures the app is scalable, secure, and utilizes the power of machine learning to make finding jobs and tracking placements as easy as possible!

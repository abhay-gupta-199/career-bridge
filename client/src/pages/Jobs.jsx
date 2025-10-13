import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Jobs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Hardcoded job data with match percentages
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$80,000 - $120,000",
      matchPercentage: 85,
      description: "We're looking for a passionate Frontend Developer to join our team. You'll work with React, TypeScript, and modern web technologies.",
      requirements: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
      category: "frontend",
      postedDate: "2 days ago",
      logo: "https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=TC"
    },
    {
      id: 2,
      title: "Backend Developer",
      company: "DataFlow Inc",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90,000 - $130,000",
      matchPercentage: 78,
      description: "Join our backend team to build scalable APIs and microservices using Node.js and Python.",
      requirements: ["Node.js", "Python", "MongoDB", "PostgreSQL", "AWS"],
      category: "backend",
      postedDate: "1 day ago",
      logo: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=DF"
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "Analytics Pro",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$100,000 - $150,000",
      matchPercentage: 92,
      description: "Work with large datasets to extract insights and build machine learning models for business intelligence.",
      requirements: ["Python", "Machine Learning", "SQL", "TensorFlow", "Statistics"],
      category: "data",
      postedDate: "3 days ago",
      logo: "https://via.placeholder.com/60x60/8B5CF6/FFFFFF?text=AP"
    },
    {
      id: 4,
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$75,000 - $110,000",
      matchPercentage: 88,
      description: "Be part of our growing startup team. You'll work on both frontend and backend development.",
      requirements: ["React", "Node.js", "MongoDB", "Express", "Git"],
      category: "fullstack",
      postedDate: "4 days ago",
      logo: "https://via.placeholder.com/60x60/F59E0B/FFFFFF?text=SX"
    },
    {
      id: 5,
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$70,000 - $100,000",
      matchPercentage: 75,
      description: "Create beautiful and intuitive user experiences for our web and mobile applications.",
      requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "HTML/CSS"],
      category: "design",
      postedDate: "5 days ago",
      logo: "https://via.placeholder.com/60x60/EF4444/FFFFFF?text=DS"
    },
    {
      id: 6,
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Remote",
      type: "Full-time",
      salary: "$95,000 - $140,000",
      matchPercentage: 82,
      description: "Manage our cloud infrastructure and deployment pipelines using modern DevOps practices.",
      requirements: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
      category: "devops",
      postedDate: "1 day ago",
      logo: "https://via.placeholder.com/60x60/06B6D4/FFFFFF?text=CT"
    },
    {
      id: 7,
      title: "Mobile App Developer",
      company: "AppMasters",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$85,000 - $125,000",
      matchPercentage: 90,
      description: "Develop cross-platform mobile applications using React Native and Flutter.",
      requirements: ["React Native", "Flutter", "JavaScript", "iOS", "Android"],
      category: "mobile",
      postedDate: "2 days ago",
      logo: "https://via.placeholder.com/60x60/84CC16/FFFFFF?text=AM"
    },
    {
      id: 8,
      title: "Product Manager",
      company: "InnovateCorp",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$110,000 - $160,000",
      matchPercentage: 68,
      description: "Lead product strategy and work with cross-functional teams to deliver exceptional user experiences.",
      requirements: ["Product Strategy", "Agile", "Analytics", "User Research", "Leadership"],
      category: "product",
      postedDate: "6 days ago",
      logo: "https://via.placeholder.com/60x60/EC4899/FFFFFF?text=IC"
    }
  ]

  const categories = [
    { id: 'all', name: 'All Jobs' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'fullstack', name: 'Full Stack' },
    { id: 'data', name: 'Data Science' },
    { id: 'design', name: 'Design' },
    { id: 'mobile', name: 'Mobile' },
    { id: 'devops', name: 'DevOps' },
    { id: 'product', name: 'Product' }
  ]

  const filteredJobs = selectedCategory === 'all' 
    ? jobs 
    : jobs.filter(job => job.category === selectedCategory)

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800'
    if (percentage >= 80) return 'bg-blue-100 text-blue-800'
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your <span className="text-blue-600">Dream Job</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover personalized job recommendations based on your skills and preferences
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedCategory === 'all' ? 'All Jobs' : categories.find(c => c.id === selectedCategory)?.name} 
              <span className="text-gray-500 font-normal">({filteredJobs.length} positions)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
                {/* Job Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={job.logo} 
                      alt={`${job.company} logo`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMatchColor(job.matchPercentage)}`}>
                    {job.matchPercentage}% match
                  </span>
                </div>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {job.salary}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {job.type} • {job.postedDate}
                  </div>
                </div>

                {/* Job Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Requirements */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                    Apply Now
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try selecting a different category or check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Don't See Your Perfect Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Create a profile to get personalized job recommendations and never miss an opportunity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="bg-white text-blue-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              Create Profile
            </a>
            <a 
              href="/login" 
              className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200 text-lg"
            >
              Sign In
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Jobs

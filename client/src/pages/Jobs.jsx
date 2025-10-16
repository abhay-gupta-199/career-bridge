import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const staggerFade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const Jobs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$80k - $120k",
      matchPercentage: 85,
      description: "Passionate about building interactive UIs using React, TypeScript, and modern web technologies.",
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
      salary: "$90k - $130k",
      matchPercentage: 78,
      description: "Build scalable APIs and microservices with Node.js, Python, and cloud databases.",
      requirements: ["Node.js", "Python", "MongoDB", "PostgreSQL", "AWS"],
      category: "backend",
      postedDate: "1 day ago",
      logo: "https://via.placeholder.com/60x60/10B981/FFFFFF?text=DF"
    },
    // ...add other jobs here
  ];

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
  ];

  const filteredJobs = selectedCategory === 'all' 
    ? jobs 
    : jobs.filter(job => job.category === selectedCategory);

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-blue-100 text-blue-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with image background */}
      <section
        className="relative py-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://taggd.in/wp-content/uploads/2022/11/11_White-collar-jobs-and-that-sinking-feeling_1920x590.png')",
        }}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 -z-10 bg-black/30 backdrop-blur-md"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex justify-start">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl p-12 shadow-2xl w-full max-w-3xl"
          >
            <motion.h1 className="text-4xl md:text-5xl font-extrabold text-[#10002b] mb-4">
              Explore Exciting Careers
            </motion.h1>
            <motion.p className="text-gray-700 text-lg md:text-xl">
              Find your perfect job match and take your career to the next level.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 justify-center">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 ${
                selectedCategory === c.id
                  ? 'bg-[#10002b] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job, i) => (
            <motion.div
              key={job.id}
              variants={staggerFade}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg object-cover"/>
                  <div>
                    <h3 className="text-lg font-bold text-[#10002b]">{job.title}</h3>
                    <p className="text-gray-700">{job.company}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMatchColor(job.matchPercentage)}`}>
                  {job.matchPercentage}% match
                </span>
              </div>
              <p className="text-gray-700 mb-3">{job.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((r, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white/50 text-[#10002b] text-xs rounded-md">{r}</span>
                ))}
              </div>
              <button className="w-full bg-[#10002b] text-white py-2 rounded-lg hover:bg-[#240046] transition-colors duration-200">
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Jobs;

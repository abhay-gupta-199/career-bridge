import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Zap, BookOpen, Layers, Rocket } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
// import RoadmapViewer from '../../components/RoadmapViewer' // Replaced with new visualization
import RoadmapGenerator from './RoadmapGenerator'
import GlassCard from '../../components/ui/GlassCard'
import AnimatedBadge from '../../components/ui/AnimatedBadge'

const StudentRoadmap = () => {
  const [activeTab, setActiveTab] = useState('generate') // generate | view
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null)


  const handleRoadmapGenerated = (data) => {
    setGeneratedRoadmap(data)
    setActiveTab('view')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="roadmaps" />
        <main className="flex-1 px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full">
                <MapPin className="text-purple-600" size={32} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900">Custom Roadmap</h1>
                <p className="text-gray-600 text-lg">Build your own learning path using Gemini AI</p>
              </div>
            </div>
          </motion.div>

          {/* Toggle View (only if roadmap exists) */}
          {generatedRoadmap && (
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'generate' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Generator
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'view' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                View Roadmap
              </button>
            </div>
          )}

          {/* Content */}
          <div className="max-w-7xl mx-auto">
            {activeTab === 'generate' ? (
              <RoadmapGenerator onGenerate={handleRoadmapGenerated} />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Roadmap Title Card */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                  <h2 className="text-3xl font-bold mb-2">{generatedRoadmap.title}</h2>
                  <p className="text-purple-100 text-lg opacity-90">{generatedRoadmap.description}</p>
                </div>

                {/* Phases Timeline */}
                <div className="relative border-l-4 border-purple-200 ml-6 space-y-12 pl-8 py-4">
                  {generatedRoadmap.phases?.map((phase, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[46px] top-0 w-8 h-8 rounded-full bg-purple-600 border-4 border-purple-100 flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>

                      <GlassCard className="p-6 hover:scale-[1.01] transition-transform duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
                          <h3 className="text-2xl font-bold text-gray-800">{phase.name}</h3>
                          <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {phase.duration}
                          </span>
                        </div>

                        <div className="space-y-6">
                          {phase.topics?.map((topic, tIdx) => (
                            <div key={tIdx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                                <BookOpen size={18} className="text-blue-500" />
                                {topic.topic}
                              </h4>
                              <p className="text-gray-600 mb-3 ml-7">{topic.description}</p>

                              {topic.resources?.length > 0 && (
                                <div className="ml-7 flex flex-wrap gap-2">
                                  {topic.resources.map((res, rIdx) => (
                                    <a
                                      key={rIdx}
                                      href={res.includes('http') ? res : `https://www.google.com/search?q=${res}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs px-3 py-1 bg-white text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-1"
                                    >
                                      RESOURCE
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default StudentRoadmap

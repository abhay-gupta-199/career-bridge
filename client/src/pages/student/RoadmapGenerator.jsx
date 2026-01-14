import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Clock, Target, BookOpen, AlertCircle, ArrowRight, Loader } from 'lucide-react'
import API from '../../api/axios'
import GlassCard from '../../components/ui/GlassCard'
import GradientCard from '../../components/ui/GradientCard'

const RoadmapGenerator = ({ onGenerate }) => {
    const [formData, setFormData] = useState({
        role: '',
        skills: '',
        availability: '',
        duration: '3'
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await API.post('/ai/roadmap/generate', formData)
            if (res.data.success && onGenerate) {
                onGenerate(res.data.roadmap)
            }
        } catch (err) {
            console.error('Generation failed:', err)
            setError(err.response?.data?.message || 'Failed to generate roadmap. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
            >
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    AI Roadmap Generator
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Create a personalized learning path tailored to your goals. Our AI analyzes your inputs to build a step-by-step guide for success.
                </p>
            </motion.div>

            <GlassCard className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Target Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Target className="w-4 h-4 text-purple-500" />
                                Target Role
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g. Full Stack Developer"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            />
                        </div>

                        {/* Current Skills */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                Current Skills
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="e.g. HTML, CSS, JavaScript"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            />
                        </div>

                        {/* Availability */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-500" />
                                Weekly Availability (Hours)
                            </label>
                            <select
                                name="availability"
                                value={formData.availability}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white"
                            >
                                <option value="">Select hours...</option>
                                <option value="5-10">5-10 hours</option>
                                <option value="10-20">10-20 hours</option>
                                <option value="20-30">20-30 hours</option>
                                <option value="30+">30+ hours</option>
                            </select>
                        </div>

                        {/* Duration */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-500" />
                                Target Duration (Months)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                min="1"
                                max="12"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Generating Your Roadmap...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Roadmap
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-3">
                            Powered by Google Gemini AI • Generates personalized learning paths
                        </p>
                    </div>
                </form>
            </GlassCard>
        </div>
    )
}

export default RoadmapGenerator

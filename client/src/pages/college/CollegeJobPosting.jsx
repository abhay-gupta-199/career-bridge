import { useState } from "react";
import API from "../../api/axios";
import {
    PlusCircle,
    Send,
    Briefcase,
    MapPin,
    Clock,
    IndianRupee,
    ChevronRight,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

const CollegeJobPosting = () => {
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        description: "",
        skillsRequired: "",
        location: "",
        salary: { min: "", max: "", currency: "INR" },
        experience: { min: "0", max: "" },
        jobType: "Full-time"
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            salary: { ...prev.salary, [name]: value }
        }));
    };

    const handleExperienceChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            experience: { ...prev.experience, [name]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.company || !formData.description) {
            return;
        }

        try {
            setLoading(true);
            const res = await API.post("/college/jobs", {
                ...formData,
                salary: formData.salary.min || formData.salary.max ? formData.salary : undefined,
                experience: formData.experience.max ? formData.experience : undefined
            });

            setSuccess(true);
            setFormData({
                title: "",
                company: "",
                description: "",
                skillsRequired: "",
                location: "",
                salary: { min: "", max: "", currency: "INR" },
                experience: { min: "0", max: "" },
                jobType: "Full-time"
            });

            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error("Error posting job:", err);
            alert(`❌ Error: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Post New Opportunity
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-gray-500 font-medium">Create exclusive job pathways for your students</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                            <Sparkles size={10} /> AI Enhanced Matching
                        </p>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-700 mb-6">
                            <CheckCircle2 className="text-emerald-500" />
                            <p className="font-bold">Job posted successfully! Relevant students from your college have been notified.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <GlassCard className="p-0 border-white/60 overflow-visible" glow>
                <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
                    {/* Section 1: Basic Info */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2 text-purple-600">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Briefcase size={20} />
                            </div>
                            <h3 className="font-bold text-lg">Position Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Job Title <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g., Software Engineering Intern"
                                        className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all group-hover:border-slate-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="e.g., Google, Microsoft, Start-up"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative flex items-center">
                                    <MapPin className="absolute left-4 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Bangalore, Hybrid, Remote"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                    Employment Type
                                </label>
                                <div className="relative flex items-center">
                                    <Clock className="absolute left-4 text-slate-400" size={18} />
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none"
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Compensation & Experience */}
                    <div className="p-8 space-y-6 bg-slate-50/50">
                        <div className="flex items-center gap-3 mb-2 text-pink-600">
                            <div className="p-2 bg-pink-100 rounded-lg">
                                <IndianRupee size={20} />
                            </div>
                            <h3 className="font-bold text-lg">Terms & Benefits</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Min Salary</label>
                                <input
                                    type="number"
                                    name="min"
                                    value={formData.salary.min}
                                    onChange={handleSalaryChange}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Max Salary</label>
                                <input
                                    type="number"
                                    name="max"
                                    value={formData.salary.max}
                                    onChange={handleSalaryChange}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Currency</label>
                                <select
                                    name="currency"
                                    value={formData.salary.currency}
                                    onChange={handleSalaryChange}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all appearance-none"
                                >
                                    <option>INR</option>
                                    <option>USD</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Min Experience (Yrs)</label>
                                <input
                                    type="number"
                                    name="min"
                                    value={formData.experience.min}
                                    onChange={handleExperienceChange}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Max Experience (Yrs)</label>
                                <input
                                    type="number"
                                    name="max"
                                    value={formData.experience.max}
                                    onChange={handleExperienceChange}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Requirements */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2 text-indigo-600">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Sparkles size={20} />
                            </div>
                            <h3 className="font-bold text-lg">Required Skills & JD</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Skills Tags</label>
                            <input
                                type="text"
                                name="skillsRequired"
                                value={formData.skillsRequired}
                                onChange={handleChange}
                                placeholder="Python, React, AWS (Comma separated)"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                            <p className="text-[10px] text-slate-400 font-medium">Add comma-separated skills for better AI matching results</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Detailed Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                placeholder="Describe the role, responsibilities, and specific requirements..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Form Footer */}
                    <div className="p-8 bg-slate-50/80 flex items-center justify-between gap-4">
                        <div className="hidden md:block">
                            <p className="text-xs text-slate-500 font-medium">Fields marked with <span className="text-red-500">*</span> are mandatory</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-purple-200 disabled:opacity-70 transition-all"
                            >
                                {loading ? "Processing..." : (
                                    <>
                                        <Send size={18} />
                                        Submit Posting
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default CollegeJobPosting;

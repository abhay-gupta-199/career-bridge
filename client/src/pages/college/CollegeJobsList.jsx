import { useState, useEffect } from "react";
import API from "../../api/axios";
import {
    Briefcase,
    MapPin,
    Eye,
    User,
    Mail,
    CheckCircle,
    XCircle,
    ExternalLink,
    ChevronRight,
    Search,
    Users,
    Clock,
    ArrowUpRight,
    Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../../components/ui/GlassCard";

const CollegeJobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [showApplications, setShowApplications] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await API.get("/college/jobs");
            setJobs(res.data);
        } catch (err) {
            console.error("Error fetching jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (jobId) => {
        try {
            const res = await API.get(`/college/jobs/applications/${jobId}`);
            setApplications(res.data.applications);
            setShowApplications(true);
        } catch (err) {
            alert("Error fetching applications");
        }
    };

    const updateApplicationStatus = async (jobId, appIndex, newStatus) => {
        try {
            await API.put(`/college/jobs/${jobId}/applications/${appIndex}`, {
                status: newStatus
            });
            fetchApplications(jobId);
        } catch (err) {
            alert("Error updating application");
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Manage Vacancies
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-gray-500 font-medium">Track placements and student engagement</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                            <Users size={10} /> {jobs.length} Active Postings
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter jobs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all w-full md:w-64 shadow-sm"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Data...</p>
                </div>
            ) : filteredJobs.length === 0 ? (
                <GlassCard className="p-12 text-center" glow>
                    <div className="p-4 bg-slate-50 rounded-2xl w-fit mx-auto mb-4">
                        <Briefcase size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No Postings Found</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">You haven't posted any jobs for your students yet. Start by creating a new opportunity.</p>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job, idx) => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <GlassCard className="h-full group hover:border-purple-200 transition-colors" glow>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-purple-50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                            <Briefcase className="text-purple-600" size={24} />
                                        </div>
                                        <span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-lg tracking-wider">
                                            {job.jobType}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">{job.title}</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{job.company}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                                        <MapPin size={14} />
                                        <span className="font-medium">{job.location || 'Flexible'}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {job.skillsRequired?.slice(0, 3).map((skill, i) => (
                                            <span key={i} className="text-[9px] font-black uppercase px-2 py-1 bg-slate-50 text-slate-400 rounded-md border border-slate-100">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.skillsRequired?.length > 3 && (
                                            <span className="text-[9px] font-black text-slate-300">+{job.skillsRequired.length - 3}</span>
                                        )}
                                    </div>

                                    <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                                <Users size={14} className="text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 leading-none">{job.applications?.length || 0}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Applied</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedJob(job);
                                                fetchApplications(job._id);
                                            }}
                                            className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-purple-600 hover:text-white transition-all group/btn"
                                        >
                                            <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Applications Slide-over/Modal */}
            <AnimatePresence>
                {showApplications && selectedJob && (
                    <div className="fixed inset-0 z-50 flex items-center justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowApplications(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm px-4"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-2xl h-screen bg-white shadow-2xl flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedJob.title}</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Applications Review</p>
                                </div>
                                <button
                                    onClick={() => setShowApplications(false)}
                                    className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                {applications.length === 0 ? (
                                    <div className="text-center py-20">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <Users size={32} className="text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No Applications Yet</p>
                                    </div>
                                ) : (
                                    applications.map((app, idx) => (
                                        <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-4 hover:border-purple-200 transition-all">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center font-black text-purple-600 text-lg shadow-sm">
                                                        {app.student?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{app.student?.name}</p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Mail size={12} /> {app.student?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-600' :
                                                        app.status === 'Rejected' ? 'bg-pink-100 text-pink-600' :
                                                            'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {app.status}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1.5 px-4 py-3 bg-white/50 rounded-xl">
                                                {app.student?.skills?.slice(0, 5).map((s, i) => (
                                                    <span key={i} className="text-[10px] font-bold text-slate-400 px-2 py-1 bg-slate-50 rounded-lg">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                {app.status !== 'Accepted' && (
                                                    <button
                                                        onClick={() => updateApplicationStatus(selectedJob._id, idx, 'Accepted')}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                                                    >
                                                        <CheckCircle size={14} /> Accept Candidate
                                                    </button>
                                                )}
                                                {app.status !== 'Rejected' && (
                                                    <button
                                                        onClick={() => updateApplicationStatus(selectedJob._id, idx, 'Rejected')}
                                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-pink-100 text-pink-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-pink-50 transition-all"
                                                    >
                                                        <XCircle size={14} /> No Thanks
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CollegeJobsList;

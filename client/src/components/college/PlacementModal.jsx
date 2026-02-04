import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, X, CheckCircle2, TrendingUp, IndianRupee } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const PlacementModal = ({ isOpen, onClose, onConfirm, studentName }) => {
    const [company, setCompany] = useState("");
    const [salary, setSalary] = useState("");
    const [role, setRole] = useState("");

    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!company) return;

        setIsSuccess(true);
        setTimeout(() => {
            onConfirm(company, { salary, role });
            setCompany("");
            setSalary("");
            setRole("");
            setIsSuccess(false);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg"
                >
                    <GlassCard className="p-0 border-white/60 shadow-2xl overflow-hidden min-h-[400px]" glow>
                        <AnimatePresence mode="wait">
                            {!isSuccess ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                                <TrendingUp size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 leading-tight">Record Placement</h2>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                                    Success milestone for <span className="text-emerald-600 font-black">{studentName}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Building2 size={12} /> Hiring Organization
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                autoFocus
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                placeholder="e.g. Google, Atlassian, Zomato"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    Designation
                                                </label>
                                                <input
                                                    type="text"
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    placeholder="SDE-1"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-600"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    Annual CTC
                                                </label>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                    <input
                                                        type="text"
                                                        value={salary}
                                                        onChange={(e) => setSalary(e.target.value)}
                                                        placeholder="e.g. 12 LPA"
                                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 px-6 py-3 border border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-slate-50 transition-all text-center"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-[2] px-8 py-3 bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={16} /> Confirm Placement
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-20 px-8 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.2, 1] }}
                                        transition={{ duration: 0.5 }}
                                        className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-200"
                                    >
                                        <CheckCircle2 size={48} />
                                    </motion.div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Placement Recorded!</h3>
                                    <p className="text-slate-500 mt-2 font-medium">Successfully updated {studentName}'s career status.</p>

                                    <div className="mt-8 flex gap-2">
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="w-2 h-2 rounded-full bg-emerald-400"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                                            className="w-2 h-2 rounded-full bg-teal-400"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, delay: 0.4 }}
                                            className="w-2 h-2 rounded-full bg-cyan-400"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PlacementModal;

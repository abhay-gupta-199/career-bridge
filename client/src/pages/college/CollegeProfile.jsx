import React, { useState } from "react";
import {
  User,
  Mail,
  Building2,
  Lock,
  Save,
  Edit3,
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../../components/ui/GlassCard";
import API from "../../api/axios";

const CollegeProfile = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: "" });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    location: user?.location || "",
    website: user?.website || "",
    description: user?.description || "",
    establishedYear: user?.establishedYear || "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match ❌" });
      return;
    }

    try {
      setLoading(true);
      const res = await API.put("/college/profile", {
        name: formData.name,
        location: formData.location,
        website: formData.website,
        description: formData.description,
        establishedYear: formData.establishedYear
      });

      setMessage({ type: "success", text: "Profile updated successfully! ✅" });
      setEditMode(false);
      setTimeout(() => setMessage({ type: null, text: "" }), 5000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Institution Profile
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-500 font-medium">Manage your identity on the platform</p>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} /> Verified Institution
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-pink-50 border-pink-100 text-pink-700'
              }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <p className="text-xs font-bold uppercase tracking-widest">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Identity */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-8 text-center" glow>
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#10002b] to-[#4b006e] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-purple-900/20">
                {user?.name?.charAt(0) || "C"}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-400 hover:text-purple-600 transition-colors">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">{user?.name}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{user?.email}</p>
            <div className="mt-6 flex justify-center">
              <span className="px-4 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {user?.role || "Institution"}
              </span>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/60" glow={false}>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Security Baseline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-500">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="text-xs font-bold">2-Factor Auth Active</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Lock size={18} className="text-amber-500" />
                <span className="text-xs font-bold">Encrypted Credentials</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2">
          <GlassCard className="p-0 border-white/60 shadow-2xl overflow-visible" glow={false}>
            <form onSubmit={handleSave} className="divide-y divide-slate-100">
              {/* General Info */}
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2 text-purple-600">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building2 size={20} />
                  </div>
                  <h3 className="font-bold text-lg">Institution Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:opacity-50 font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Campus</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:opacity-50 font-bold text-slate-700"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Official Website</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:opacity-50 font-bold text-slate-700"
                      placeholder="https://college.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Charter Year</label>
                    <input
                      type="number"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:opacity-50 font-bold text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Institutional Narrative</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!editMode}
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:opacity-50 resize-none font-medium text-slate-600"
                    placeholder="Briefly describe your institution's mission and strengths..."
                  />
                </div>
              </div>

              {/* Footer Controls */}
              <div className="p-8 bg-slate-50/50 flex justify-end gap-4">
                {!editMode ? (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-50 transition-all"
                  >
                    <Edit3 size={16} /> Enter Edit Mode
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-8 py-3 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#10002b] via-[#4b006e] to-[#240046] text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-purple-900/20 transition-all disabled:opacity-70"
                    >
                      <Save size={16} /> {loading ? "Saving..." : "Commit Changes"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CollegeProfile;


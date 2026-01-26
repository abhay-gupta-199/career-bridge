import React, { useState } from "react";
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  MapPin,
  Mail,
  Filter,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../../components/ui/GlassCard";

import PlacementModal from "../../components/college/PlacementModal";

const CollegeStudents = ({ students, updatePlacementStatus, loading }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    if (filter === "placed") return matchesSearch && student.isPlaced;
    if (filter === "unplaced") return matchesSearch && !student.isPlaced;
    return matchesSearch;
  });

  const handlePlacementConfirm = (company) => {
    if (activeStudent) {
      updatePlacementStatus(activeStudent._id, true, company);
      setModalOpen(false);
      setActiveStudent(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Student Register
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-500 font-medium">Manage and monitor student career readiness</p>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
              <Users size={10} /> {students.length} Enrolled
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all w-full md:w-80 shadow-sm font-medium"
            />
          </div>
          <div className="flex bg-white rounded-2xl p-1 border border-slate-100 shadow-sm">
            {['all', 'placed', 'unplaced'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-purple-600"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table Section */}
      <GlassCard className="p-0 border-white/60 shadow-2xl" glow={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Information</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tech Stack</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Graduation</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Outcome Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregating Records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="p-4 bg-slate-50 rounded-2xl w-fit mx-auto mb-4">
                      <Users size={32} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No matches found</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center font-black text-purple-600 text-lg shadow-sm group-hover:scale-105 transition-transform">
                          {student.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{student.name}</p>
                          <p className="text-xs text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                            <Mail size={12} /> {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {student.skills?.slice(0, 2).map((skill, index) => (
                          <span key={index} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold uppercase rounded-lg shadow-sm">
                            {skill}
                          </span>
                        ))}
                        {student.skills?.length > 2 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-400 text-[10px] font-black rounded-lg">
                            +{student.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">{student.graduationYear || "Batch NA"}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Candidate Year</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 ${student.isPlaced
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${student.isPlaced ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {student.isPlaced ? "Placed" : "Unplaced"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => {
                          if (student.isPlaced) {
                            updatePlacementStatus(student._id, false);
                          } else {
                            setActiveStudent(student);
                            setModalOpen(true);
                          }
                        }}
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${student.isPlaced
                          ? "bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white"
                          : "bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          }`}
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <PlacementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handlePlacementConfirm}
        studentName={activeStudent?.name}
      />
    </div>
  );
};

export default CollegeStudents;

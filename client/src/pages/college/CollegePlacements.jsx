import React, { useState } from "react";
import {
  Briefcase,
  Search,
  ChevronRight,
  ArrowUpRight,
  Users,
  Target,
  CheckCircle2,
  AlertCircle,
  Building2,
  PieChart as PieChartIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../../components/ui/GlassCard";

import PlacementModal from "../../components/college/PlacementModal";

const CollegePlacements = ({ students, updatePlacementStatus }) => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      (student.placedCompany || "").toLowerCase().includes(search.toLowerCase()) ||
      (student.isPlaced ? "placed" : "unplaced").includes(search.toLowerCase())
  );

  const handlePlacementConfirm = (company) => {
    if (activeStudent) {
      updatePlacementStatus(activeStudent._id, true, company);
      setModalOpen(false);
      setActiveStudent(null);
    }
  };

  // Summary stats
  const totalStudents = students.length;
  const placedStudents = students.filter(s => s.isPlaced).length;
  const unplacedStudents = totalStudents - placedStudents;
  const placementRate = totalStudents ? Math.round((placedStudents / totalStudents) * 100) : 0;

  // Top companies
  const companyCountMap = {};
  students.forEach(s => {
    if (s.isPlaced && s.placedCompany) {
      companyCountMap[s.placedCompany] = (companyCountMap[s.placedCompany] || 0) + 1;
    }
  });
  const topCompanies = Object.entries(companyCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

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
            Placement Insights
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-500 font-medium">Detailed tracking of student career success</p>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
              <PieChartIcon size={10} /> {placementRate}% Success Rate
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search company or student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all w-full shadow-sm font-medium"
          />
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Batch', value: totalStudents, icon: Users, color: 'blue', sub: 'Total Students' },
          { title: 'Placed', value: placedStudents, icon: CheckCircle2, color: 'emerald', sub: 'Offers Secured' },
          { title: 'Unplaced', value: unplacedStudents, icon: AlertCircle, color: 'pink', sub: 'Seeking Roles' },
          { title: 'Placement Rate', value: `${placementRate}%`, icon: Target, color: 'amber', sub: 'Overall Performance' }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard glow={i === 1} className="p-6 border-white/60 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                  <card.icon size={24} />
                </div>
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</h3>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-2 group-hover:text-emerald-600 transition-colors">{card.sub}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-2">
          <GlassCard className="p-0 border-white/60 shadow-2xl h-full" glow={false}>
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Placement Activity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No records found</td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => (
                      <tr key={student._id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm ${student.isPlaced ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                              }`}>
                              {student.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-none">{student.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                {student.isPlaced ? <><Building2 size={10} /> {student.placedCompany}</> : "Ready for interview"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${student.isPlaced ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            }`}>
                            {student.isPlaced ? "Confirmed" : "Candidate"}
                          </span>
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
                            className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${student.isPlaced
                              ? "bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white"
                              : "bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white text-emerald-600 border border-emerald-100"
                              }`}
                          >
                            {student.isPlaced ? "Revoke" : "Mark Placed"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Top Hiring Partners */}
        <div className="space-y-6">
          <GlassCard className="p-8 border-white/60 h-full" glow={false}>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Building2 size={20} className="text-purple-600" /> Hiring Partners
              </h3>
              <p className="text-xs text-slate-400 font-medium whitespace-pre-wrap">Top companies recruiting from your pool</p>
            </div>

            <div className="space-y-4">
              {topCompanies.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                  <Building2 size={40} className="mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Waiting for offers...</p>
                </div>
              ) : (
                topCompanies.map((company, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-purple-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-purple-600 shadow-sm">
                        {company.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{company.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 leading-none">{company.count}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Hires</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      <PlacementModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handlePlacementConfirm}
        studentName={activeStudent?.name}
      />
    </div>
  );
};

export default CollegePlacements;

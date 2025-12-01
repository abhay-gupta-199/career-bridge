import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, MapPin, Award, Briefcase, Lock, Unlock, DownloadCloud, TrendingUp } from 'lucide-react';
import API from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Cell, Legend } from 'recharts';
import GlassCard from "./ui/GlassCard"
import AnimatedBadge from './ui/AnimatedBadge';

/**
 * StudentDetailsModal Component
 * Shows comprehensive student profile with applications, skills, and admin controls
 */
const StudentDetailsModal = ({ student, isOpen, onClose, onBlockStatusChange }) => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !student) return null;

  const handleBlockToggle = async () => {
    setLoading(true);
    try {
      const response = await API.post(`/owner/students/${student._id}/toggle-block`, {
        isBlocking: !student.isBlocked,
        reason: blockReason
      });

      onBlockStatusChange(response.data.student);
      setBlockReason('');
      setShowBlockForm(false);
      setIsBlocking(student.isBlocked);
      alert(response.data.message);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed to update block status'));
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await API.get('/owner/students-export/csv', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students-export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (error) {
      alert('Failed to export CSV');
    }
  };

  const applicationStatusColors = {
    'Applied': 'from-blue-400 to-blue-600',
    'Accepted': 'from-green-400 to-emerald-600',
    'Rejected': 'from-red-400 to-rose-600',
    'Under Review': 'from-yellow-400 to-orange-600'
  };

  // Prepare chart data
  const matchChartData = (student.matches || [])
    .slice(0, 5)
    .map(job => ({
      name: job.title.slice(0, 10),
      match: job.matchPercentage
    }));

  const applicationStats = [
    { name: 'Applied', value: student.applicationStats?.applied || 0, fill: '#3b82f6' },
    { name: 'Shortlisted', value: student.applicationStats?.shortlisted || 0, fill: '#10b981' },
    { name: 'Rejected', value: student.applicationStats?.rejected || 0, fill: '#ef4444' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white p-6 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{student.name}</h2>
            <p className="text-purple-100 flex items-center gap-2">
              <Mail size={16} /> {student.email}
            </p>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X size={28} />
          </motion.button>
        </div>

        <div className="p-8 space-y-8">
          {/* Status Banner */}
          {student.isBlocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-4 flex items-start gap-4"
            >
              <Lock className="text-red-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="font-bold text-red-800">Account Blocked</p>
                <p className="text-red-700 text-sm">{student.blockReason}</p>
                <p className="text-red-600 text-xs mt-1">
                  Blocked on: {new Date(student.blockedAt).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          )}

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard glow delay={0.1}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Skills</p>
                  <p className="text-2xl font-black text-purple-600">{student.skills?.length || 0}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.2}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Applications</p>
                  <p className="text-2xl font-black text-blue-600">{student.applicationStats?.total || 0}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow delay={0.3}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Avg Match</p>
                  <p className="text-2xl font-black text-green-600">
                    {student.matches?.length > 0
                      ? Math.round(student.matches.reduce((a, m) => a + m.matchPercentage, 0) / student.matches.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Personal & Academic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Email</p>
                  <p className="text-gray-900">{student.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">College</p>
                  <p className="text-gray-900">{student.college || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Graduation Year</p>
                  <p className="text-gray-900">{student.graduationYear || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Placement Status</p>
                  <p className={`font-semibold ${student.isPlaced ? 'text-green-600' : 'text-yellow-600'}`}>
                    {student.isPlaced ? `Placed @ ${student.placedCompany}` : 'Unplaced'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Member Since</p>
                  <p className="text-gray-900">{new Date(student.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Skills ({student.skills?.length || 0})</h3>
              <div className="flex flex-wrap gap-2">
                {student.skills && student.skills.length > 0 ? (
                  student.skills.map((skill, idx) => (
                    <AnimatedBadge
                      key={idx}
                      text={skill}
                      variant="skill"
                      icon="✨"
                    />
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No skills added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          {(student.matches?.length > 0 || student.applicationStats?.total > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Match Percentage Chart */}
              {student.matches?.length > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Top Job Matches</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={matchChartData}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="match" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Application Status Chart */}
              {student.applicationStats?.total > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Application Status</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={applicationStats}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {applicationStats.map((entry, idx) => (
                          <Cell key={idx} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Applied Jobs Section */}
          {student.applications && student.applications.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">📋 Applied Jobs ({student.applications.length})</h3>
              <div className="space-y-3">
                {student.applications.map((job, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{job.title}</p>
                        <p className="text-sm text-blue-600 font-semibold">{job.company}</p>
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                          <MapPin size={14} /> {job.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <AnimatedBadge
                          text={job.status}
                          variant={
                            job.status === 'Accepted' ? 'skill' :
                            job.status === 'Rejected' ? 'missing' : 'status'
                          }
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          {new Date(job.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Jobs Section */}
          {student.matches && student.matches.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-lg">⭐ AI-Matched Jobs ({student.matches.length})</h3>
              <div className="space-y-3">
                {student.matches.slice(0, 10).map((job, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {job.matchPercentage}%
                        </div>
                        <p className="text-xs text-gray-600">Match</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">✅ Your Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {job.matchedSkills?.slice(0, 2).map((skill, jdx) => (
                            <AnimatedBadge key={jdx} text={skill} variant="skill" icon="✓" />
                          ))}
                          {(job.matchedSkills?.length || 0) > 2 && (
                            <span className="text-xs text-gray-600">+{job.matchedSkills.length - 2}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">❌ Missing Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {job.missingSkills?.slice(0, 2).map((skill, jdx) => (
                            <AnimatedBadge key={jdx} text={skill} variant="missing" icon="⊘" />
                          ))}
                          {(job.missingSkills?.length || 0) > 2 && (
                            <span className="text-xs text-gray-600">+{job.missingSkills.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Actions Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-300">
            <h3 className="font-bold text-gray-900 mb-4">🔐 Admin Actions</h3>

            {!showBlockForm ? (
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBlockForm(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    student.isBlocked
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg'
                  }`}
                >
                  {student.isBlocked ? (
                    <>
                      <Unlock size={20} />
                      Unblock Student
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      Block Student
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg transition-all"
                >
                  <DownloadCloud size={20} />
                  Export CSV
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 border-2 border-gray-300"
              >
                <p className="text-sm text-gray-700 mb-3 font-semibold">
                  {student.isBlocked ? 'Unblock this student?' : 'Block this student?'}
                </p>
                {!student.isBlocked && (
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-600 mb-2 block">Reason (optional)</label>
                    <textarea
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="Why are you blocking this student?"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows="3"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBlockToggle}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowBlockForm(false);
                      setBlockReason('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentDetailsModal;

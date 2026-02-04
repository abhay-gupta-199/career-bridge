import React, { useState } from 'react';
import { Briefcase, AlertCircle, CheckCircle2, Tag, Loader, Plus, X } from 'lucide-react';
import API from '../../api/axios';

/**
 * Job Description Creation Form with Skill Parsing
 * Extracts and displays skills from JD automatically
 */

const JobDescriptionForm = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    skillsRequired: [],
    location: '',
    jobType: 'Full-time',
    salary: { min: '', max: '', currency: 'INR' },
    experience: { min: 0, max: 5 }
  });

  const [parsedSkills, setParsedSkills] = useState([]);
  const [categorized, setCategorized] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle nested input
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Add skill manually
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  // Remove skill
  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(s => s !== skill)
    }));
  };

  // Parse skills from JD
  const handleParseSkills = async () => {
    if (!formData.description && !formData.requirements) {
      setError('Please provide job description or requirements');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await API.post('/api/skills/extract-job-skills', {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        skillsRequired: formData.skillsRequired
      });

      const data = response.data.data;
      setParsedSkills(data.combinedSkills);
      setCategorized(data.categorized);

      // Merge parsed skills with manually added ones
      const mergedSkills = [...new Set([...formData.skillsRequired, ...data.combinedSkills])];
      setFormData(prev => ({
        ...prev,
        skillsRequired: mergedSkills
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to parse skills');
    } finally {
      setLoading(false);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Create job
      const jobResponse = await API.post('/api/owner/jobs', formData);
      const jobId = jobResponse.data.data._id;

      // Parse skills for the created job
      await API.post(`/api/skills/parse-job/${jobId}`);

      setSuccess(true);
      setFormData({
        title: '',
        company: '',
        description: '',
        requirements: '',
        skillsRequired: [],
        location: '',
        jobType: 'Full-time',
        salary: { min: '', max: '', currency: 'INR' },
        experience: { min: 0, max: 5 }
      });
      setParsedSkills([]);
      setCategorized({});

      if (onJobCreated) {
        onJobCreated(jobResponse.data.data);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Briefcase className="w-8 h-8 text-indigo-600" />
        Post New Job
      </h2>
      <p className="text-gray-600 mb-8">Create a job posting with automatic skill extraction</p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900">Job Created Successfully!</p>
            <p className="text-green-700">The job has been posted and skills have been parsed</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior React Developer"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Job Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detailed job description..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
            rows="5"
            required
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Requirements</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            placeholder="Job requirements and qualifications..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
            rows="4"
          />
        </div>

        {/* Salary & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Min Salary</label>
            <input
              type="number"
              value={formData.salary.min}
              onChange={(e) => handleNestedChange('salary', 'min', e.target.value)}
              placeholder="Min"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Max Salary</label>
            <input
              type="number"
              value={formData.salary.max}
              onChange={(e) => handleNestedChange('salary', 'max', e.target.value)}
              placeholder="Max"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Min Experience (years)</label>
            <input
              type="number"
              value={formData.experience.min}
              onChange={(e) => handleNestedChange('experience', 'min', parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Max Experience (years)</label>
            <input
              type="number"
              value={formData.experience.max}
              onChange={(e) => handleNestedChange('experience', 'max', parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Skills Management */}
        <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" />
            Skills Required
          </h3>

          {/* Manual Skill Entry */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add skills manually..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Auto-Parse Button */}
          <button
            type="button"
            onClick={handleParseSkills}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition mb-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Parsing Skills...
              </>
            ) : (
              'Auto-Parse Skills from Description'
            )}
          </button>

          {/* Skills Display */}
          {formData.skillsRequired.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Added Skills ({formData.skillsRequired.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.skillsRequired.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-indigo-300 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Skills Preview */}
          {Object.entries(categorized).some(([_, skills]) => skills.length > 0) && (
            <div className="mt-4 pt-4 border-t border-indigo-300">
              <p className="text-sm font-semibold text-gray-900 mb-3">Skill Categories</p>
              {Object.entries(categorized).map(([category, skills]) => (
                skills.length > 0 && (
                  <div key={category} className="mb-3">
                    <p className="text-xs font-bold text-gray-700 capitalize mb-2">{category}</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="bg-white text-gray-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-bold transition"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition"
          >
            {loading ? 'Creating...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobDescriptionForm;

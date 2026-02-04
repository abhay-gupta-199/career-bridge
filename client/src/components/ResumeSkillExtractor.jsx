import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle2, Tag, Loader } from 'lucide-react';
import API from '../../api/axios';

/**
 * Resume Upload Component with Skill Extraction
 * Displays extracted skills from uploaded resume
 */

const ResumeSkillExtractor = ({ onSkillsExtracted }) => {
  const [resumeText, setResumeText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [categorized, setCategorized] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simple text extraction - in production, use PDF/DOCX parsing library
    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeText(event.target.result);
    };
    reader.readAsText(file);
  };

  // Handle paste/text input
  const handlePasteText = (e) => {
    const text = e.target.value;
    setResumeText(text);
  };

  // Extract skills
  const handleExtractSkills = async () => {
    if (!resumeText.trim()) {
      setError('Please provide resume text');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await API.post('/api/skills/extract-resume-skills', {
        resumeText
      });

      const data = response.data.data;
      setExtractedSkills(data.extractedSkills);
      setCategorized(data.categorized);
      setSuccess(true);

      if (onSkillsExtracted) {
        onSkillsExtracted(data.extractedSkills);
      }

      // Auto-save to profile
      await API.put('/api/student/profile', {
        skills: data.extractedSkills
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to extract skills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6 text-indigo-600" />
        Resume Skill Extraction
      </h2>

      {/* Upload/Paste Section */}
      <div className="space-y-4 mb-6">
        {/* File Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-gray-700 font-semibold">Click to upload or paste resume</p>
          <p className="text-sm text-gray-500">Supports TXT, PDF, and DOCX files</p>
        </div>

        {/* Text Input */}
        <textarea
          value={resumeText}
          onChange={handlePasteText}
          placeholder="Or paste your resume text here..."
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
          rows="6"
        />

        {/* Extract Button */}
        <button
          onClick={handleExtractSkills}
          disabled={loading || !resumeText.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Extracting Skills...
            </>
          ) : (
            'Extract Skills from Resume'
          )}
        </button>
      </div>

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
            <p className="font-semibold text-green-900">Skills Extracted Successfully!</p>
            <p className="text-green-700">Found {extractedSkills.length} unique skills in your resume</p>
          </div>
        </div>
      )}

      {/* Extracted Skills Display */}
      {extractedSkills.length > 0 && (
        <div className="space-y-6">
          {/* All Skills */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-600" />
              All Extracted Skills ({extractedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {extractedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Categorized Skills */}
          {Object.entries(categorized).map(([category, skills]) => (
            skills.length > 0 && (
              <div key={category}>
                <h4 className="text-md font-bold text-gray-900 mb-3 capitalize">
                  {category.replace(/([A-Z])/g, ' $1').trim()} ({skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => {
                    const colors = {
                      frontend: 'bg-blue-100 text-blue-700',
                      backend: 'bg-green-100 text-green-700',
                      database: 'bg-purple-100 text-purple-700',
                      devops: 'bg-orange-100 text-orange-700',
                      testing: 'bg-pink-100 text-pink-700',
                      tools: 'bg-cyan-100 text-cyan-700',
                      dataml: 'bg-yellow-100 text-yellow-700',
                      other: 'bg-gray-100 text-gray-700'
                    };

                    return (
                      <span
                        key={idx}
                        className={`${colors[category] || colors.other} px-3 py-1 rounded-full text-sm font-semibold`}
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeSkillExtractor;

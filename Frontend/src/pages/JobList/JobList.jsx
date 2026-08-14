import React, { useState, useEffect } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import JobCard from '../../components/JobCard/JobCard';
import Modal from '../../components/Modal/Modal';
import api from '../../services/api';
import './JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [minSalary, setMinSalary] = useState('');

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [category, jobType, experienceLevel]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.query = searchTerm;
      if (location) params.location = location;
      if (category !== 'All') params.category = category;
      if (jobType !== 'All') params.job_type = jobType;
      if (experienceLevel !== 'All') params.experience_level = experienceLevel;
      if (minSalary) params.min_salary = minSalary;

      const res = await api.get('/jobs', { params });
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocation('');
    setCategory('All');
    setJobType('All');
    setExperienceLevel('All');
    setMinSalary('');
    fetchJobs();
  };

  const handleSaveToggle = async (job) => {
    try {
      if (job.saved) {
        await api.delete(`/jobs/${job.id}/unsave`);
      } else {
        await api.post(`/jobs/${job.id}/save`);
      }
      setJobs(jobs.map(j => j.id === job.id ? { ...j, saved: !j.saved } : j));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setCoverLetter('');
    setModalMessage('');
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    setApplying(true);

    try {
      await api.post(`/jobs/${selectedJob.id}/apply`, { cover_letter: coverLetter });
      setModalMessage('Application submitted successfully!');
      setJobs(jobs.map(j => j.id === selectedJob.id ? { ...j, applied: true } : j));
      setTimeout(() => {
        setSelectedJob(null);
      }, 1500);
    } catch (err) {
      setModalMessage(err.response?.data?.detail || 'Application failed.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="job-list-layout animate-fade">
      {/* Filter Sidebar */}
      <aside className="filter-sidebar">
        <div className="filter-header">
          <span className="filter-title"><FiFilter /> Filters</span>
          <button className="btn-reset-filter" onClick={handleResetFilters}>Reset All</button>
        </div>

        <form onSubmit={handleSearchSubmit}>
          <div className="filter-group">
            <label className="filter-label">Job Title / Keyword</label>
            <input
              type="text"
              placeholder="e.g. React, Developer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Location</label>
            <input
              type="text"
              placeholder="e.g. Remote, San Francisco"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="DevOps">DevOps</option>
              <option value="Marketing">Marketing</option>
              <option value="Product">Product Management</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Job Type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Experience Levels</option>
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior-level">Senior-level</option>
              <option value="Lead / Executive">Lead / Executive</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Minimum Salary ($/yr)</label>
            <input
              type="number"
              placeholder="e.g. 100000"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="filter-input"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--primary-gradient)',
              color: '#FFF',
              fontWeight: '700',
              marginTop: '10px'
            }}
          >
            Apply Filters
          </button>
        </form>
      </aside>

      {/* Main Jobs Listing */}
      <section className="job-results-container">
        <div className="results-header-bar">
          <h2 className="results-count">
            {loading ? 'Searching opportunities...' : `${jobs.length} Jobs Found`}
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading active job postings...</div>
        ) : jobs.length === 0 ? (
          <div style={{
            background: '#FFF',
            padding: '40px',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <h3>No jobs matched your criteria</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Try resetting filters or adjusting search terms.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSaveToggle={handleSaveToggle}
                onApplyClick={handleApplyClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* Application Modal */}
      <Modal
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        title={`Apply for ${selectedJob?.title}`}
      >
        <form onSubmit={handleSubmitApplication}>
          {modalMessage && (
            <div className={`auth-error-banner`} style={{ background: modalMessage.includes('success') ? 'var(--status-accepted-bg)' : 'var(--status-rejected-bg)', color: modalMessage.includes('success') ? 'var(--status-accepted)' : 'var(--status-rejected)' }}>
              {modalMessage}
            </div>
          )}

          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Company: <strong>{selectedJob?.company_name}</strong> • Location: <strong>{selectedJob?.location}</strong>
          </p>

          <div className="auth-form-group">
            <label className="auth-label">Cover Letter / Note to Recruiter</label>
            <textarea
              rows="6"
              placeholder="Introduce yourself and explain why you're a great fit for this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="auth-input"
              style={{ padding: '12px', resize: 'vertical' }}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={applying}
          >
            {applying ? 'Submitting Application...' : 'Submit Application Now'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default JobList;

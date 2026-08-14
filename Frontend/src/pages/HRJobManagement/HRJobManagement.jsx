import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiEye } from 'react-icons/fi';
import api from '../../services/api';
import './HRJobManagement.css';

const HRJobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHRJobs();
  }, []);

  const fetchHRJobs = async () => {
    try {
      const res = await api.get('/hr/jobs');
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await api.delete(`/hr/delete-job/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading active postings...</div>;

  return (
    <div className="job-mgmt-container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Job Postings Management</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Create, edit, toggle visibility, and monitor applicant pipelines.</p>
        </div>

        <button 
          onClick={() => navigate('/hr/jobs/create')}
          style={{
            background: 'var(--secondary-gradient)',
            color: '#FFF',
            padding: '10px 24px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: '700',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiPlus /> Post New Job
        </button>
      </div>

      <div className="job-mgmt-table-card">
        {jobs.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No job postings created yet. Click "Post New Job" to list your first vacancy.
          </div>
        ) : (
          <table className="mgmt-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Category</th>
                <th>Type & Location</th>
                <th>Salary Range</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{job.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Posted {new Date(job.created_at).toLocaleDateString()}</div>
                  </td>
                  <td><span className="job-tag">{job.category}</span></td>
                  <td>{job.job_type} • {job.location}</td>
                  <td>${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/hr/candidates?jobId=${job.id}`)}
                      style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', fontWeight: '700', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <FiUsers /> {job.applicant_count} Applicants
                    </button>
                  </td>
                  <td>
                    <span className={`status-pill status-${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => navigate(`/hr/jobs/edit/${job.id}`)}
                        title="Edit Job"
                        style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '8px', color: 'var(--primary)' }}
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job.id)}
                        title="Delete Job"
                        style={{ background: 'var(--status-rejected-bg)', border: 'none', padding: '8px', borderRadius: '8px', color: 'var(--status-rejected)' }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HRJobManagement;

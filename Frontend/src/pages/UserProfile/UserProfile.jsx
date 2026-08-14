import React, { useState, useEffect } from 'react';
import { FiEdit3, FiUploadCloud, FiPlus, FiTrash2, FiMapPin, FiMail, FiPhone, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import api from '../../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const { refreshUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '', headline: '', bio: '', location: '' });

  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const [isAddEduOpen, setIsAddEduOpen] = useState(false);
  const [eduFormData, setEduFormData] = useState({ institution: '', degree: '', field_of_study: '', start_year: 2020, end_year: 2024 });

  const [isAddExpOpen, setIsAddExpOpen] = useState(false);
  const [expFormData, setExpFormData] = useState({ company: '', title: '', location: '', start_date: '', end_date: 'Present', description: '' });

  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      setProfile(res.data);
      setEditFormData({
        name: res.data.name || '',
        phone: res.data.phone || '',
        headline: res.data.headline || '',
        bio: res.data.bio || '',
        location: res.data.location || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', editFormData);
      setIsEditProfileOpen(false);
      fetchProfile();
      refreshUserProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploadingResume(true);
    setResumeMessage('');

    try {
      const res = await api.post('/user/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeMessage('Resume uploaded successfully!');
      fetchProfile();
      refreshUserProfile();
    } catch (err) {
      setResumeMessage(err.response?.data?.detail || 'Resume upload failed.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      await api.post('/user/skills', { skill_name: newSkill.trim() });
      setNewSkill('');
      setIsAddSkillOpen(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await api.delete(`/user/skills/${skillId}`);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/education', eduFormData);
      setIsAddEduOpen(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveEdu = async (id) => {
    try {
      await api.delete(`/user/education/${id}`);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/experience', expFormData);
      setIsAddExpOpen(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveExp = async (id) => {
    try {
      await api.delete(`/user/experience/${id}`);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading user profile...</div>;

  return (
    <div className="profile-container animate-fade">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div className="profile-avatar-large">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="profile-name">{profile?.name}</h1>
            <div className="profile-headline">{profile?.headline || 'Candidate Developer'}</div>
            <div className="profile-meta-row">
              <span><FiMail /> {profile?.email}</span>
              {profile?.phone && <span><FiPhone /> {profile?.phone}</span>}
              {profile?.location && <span><FiMapPin /> {profile?.location}</span>}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsEditProfileOpen(true)}
          style={{
            background: 'var(--primary-gradient)',
            color: '#FFF',
            padding: '10px 20px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: '700',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiEdit3 /> Edit Profile
        </button>
      </div>

      {/* Resume Section */}
      <div className="profile-section-card">
        <div className="section-header-row">
          <h2 className="section-title">Resume Document</h2>
        </div>

        {resumeMessage && (
          <div className="auth-error-banner" style={{ background: resumeMessage.includes('success') ? 'var(--status-accepted-bg)' : 'var(--status-rejected-bg)', color: resumeMessage.includes('success') ? 'var(--status-accepted)' : 'var(--status-rejected)' }}>
            {resumeMessage}
          </div>
        )}

        <div className="resume-box">
          {profile?.resume_url ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FiFileText style={{ fontSize: '28px', color: 'var(--primary)' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>Current Resume Uploaded</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{profile.resume_url}</div>
                </div>
              </div>
              <a 
                href={profile.resume_url} 
                target="_blank" 
                rel="noreferrer"
                style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px 18px', borderRadius: 'var(--radius-pill)', fontWeight: '700', fontSize: '13px' }}
              >
                View PDF/DOCX
              </a>
            </div>
          ) : (
            <div>
              <FiUploadCloud style={{ fontSize: '40px', color: 'var(--primary)', marginBottom: '8px' }} />
              <div style={{ fontWeight: '700', fontSize: '15px' }}>Upload your latest Resume (PDF or DOCX)</div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Max file size 10MB</p>
            </div>
          )}

          <div style={{ marginTop: '16px' }}>
            <label style={{ background: 'var(--primary-gradient)', color: '#FFF', padding: '10px 24px', borderRadius: 'var(--radius-pill)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'inline-block' }}>
              {uploadingResume ? 'Uploading...' : 'Choose File to Upload'}
              <input type="file" accept=".pdf,.docx" onChange={handleResumeUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="profile-section-card">
        <div className="section-header-row">
          <h2 className="section-title">Technical Skills</h2>
          <button className="section-link" onClick={() => setIsAddSkillOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiPlus /> Add Skill
          </button>
        </div>

        <div className="skills-pill-container">
          {profile?.skills?.map((s) => (
            <span key={s.id} className="skill-pill">
              {s.name}
              <button className="skill-delete-btn" onClick={() => handleRemoveSkill(s.id)}>×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div className="profile-section-card">
        <div className="section-header-row">
          <h2 className="section-title">Work Experience</h2>
          <button className="section-link" onClick={() => setIsAddExpOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiPlus /> Add Experience
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {profile?.experience?.map((exp) => (
            <div key={exp.id} style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{exp.title}</h3>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>{exp.company} • {exp.location}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{exp.start_date} - {exp.end_date}</div>
                {exp.description && <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '8px' }}>{exp.description}</p>}
              </div>
              <button onClick={() => handleRemoveExp(exp.id)} style={{ background: 'none', border: 'none', color: 'var(--status-rejected)' }}><FiTrash2 /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="profile-section-card">
        <div className="section-header-row">
          <h2 className="section-title">Education</h2>
          <button className="section-link" onClick={() => setIsAddEduOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiPlus /> Add Education
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {profile?.education?.map((edu) => (
            <div key={edu.id} style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>{edu.degree} in {edu.field_of_study}</h3>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>{edu.institution}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{edu.start_year} - {edu.end_year || 'Present'}</div>
              </div>
              <button onClick={() => handleRemoveEdu(edu.id)} style={{ background: 'none', border: 'none', color: 'var(--status-rejected)' }}><FiTrash2 /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Candidate Profile">
        <form onSubmit={handleUpdateProfile}>
          <div className="auth-form-group">
            <label className="auth-label">Full Name</label>
            <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Headline</label>
            <input type="text" value={editFormData.headline} onChange={(e) => setEditFormData({ ...editFormData, headline: e.target.value })} className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Location</label>
            <input type="text" value={editFormData.location} onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })} className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Phone</label>
            <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <button type="submit" className="auth-submit-btn">Save Changes</button>
        </form>
      </Modal>

      {/* Add Skill Modal */}
      <Modal isOpen={isAddSkillOpen} onClose={() => setIsAddSkillOpen(false)} title="Add New Skill Tag">
        <form onSubmit={handleAddSkill}>
          <div className="auth-form-group">
            <label className="auth-label">Skill Name</label>
            <input type="text" placeholder="e.g. React.js, Python, AWS" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <button type="submit" className="auth-submit-btn">Add Skill Tag</button>
        </form>
      </Modal>

      {/* Add Experience Modal */}
      <Modal isOpen={isAddExpOpen} onClose={() => setIsAddExpOpen(false)} title="Add Work Experience">
        <form onSubmit={handleAddExperience}>
          <div className="auth-form-group">
            <label className="auth-label">Company Name</label>
            <input type="text" value={expFormData.company} onChange={(e) => setExpFormData({ ...expFormData, company: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Job Title</label>
            <input type="text" value={expFormData.title} onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Start Date</label>
            <input type="text" placeholder="YYYY-MM" value={expFormData.start_date} onChange={(e) => setExpFormData({ ...expFormData, start_date: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <button type="submit" className="auth-submit-btn">Save Experience</button>
        </form>
      </Modal>

      {/* Add Education Modal */}
      <Modal isOpen={isAddEduOpen} onClose={() => setIsAddEduOpen(false)} title="Add Education Record">
        <form onSubmit={handleAddEducation}>
          <div className="auth-form-group">
            <label className="auth-label">Institution / University</label>
            <input type="text" value={eduFormData.institution} onChange={(e) => setEduFormData({ ...eduFormData, institution: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Degree</label>
            <input type="text" value={eduFormData.degree} onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Field of Study</label>
            <input type="text" value={eduFormData.field_of_study} onChange={(e) => setEduFormData({ ...eduFormData, field_of_study: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <button type="submit" className="auth-submit-btn">Save Education</button>
        </form>
      </Modal>
    </div>
  );
};

export default UserProfile;

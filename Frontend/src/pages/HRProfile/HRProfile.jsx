import React, { useState, useEffect } from 'react';
import { FiBriefcase, FiMail, FiPhone, FiGlobe, FiMapPin, FiEdit3 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import api from '../../services/api';
import './HRProfile.css';

const HRProfile = () => {
  const { refreshHRProfile } = useAuth();
  const [hrData, setHrData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', company_name: '', company_role: '' });

  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState({ name: '', website: '', location: '', description: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/hr/profile');
      setHrData(res.data);
      setProfileForm({
        name: res.data.name || '',
        phone: res.data.phone || '',
        company_name: res.data.company_name || '',
        company_role: res.data.company_role || ''
      });
      const comp = res.data.company || {};
      setCompanyForm({
        name: comp.name || res.data.company_name || '',
        website: comp.website || '',
        location: comp.location || '',
        description: comp.description || ''
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
      await api.put('/hr/profile', profileForm);
      setIsEditProfileOpen(false);
      fetchProfile();
      refreshHRProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      await api.post('/hr/company', companyForm);
      setIsEditCompanyOpen(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading HR profile...</div>;

  const company = hrData?.company || {};

  return (
    <div className="hr-profile-container animate-fade">
      {/* Recruiter Card */}
      <div className="profile-header-card">
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div className="avatar-circle" style={{ width: '80px', height: '80px', fontSize: '32px', background: 'var(--secondary-gradient)' }}>
            {hrData?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="profile-name">{hrData?.name}</h1>
            <div style={{ fontSize: '15px', color: 'var(--secondary)', fontWeight: '700' }}>
              {hrData?.company_role} • {hrData?.company_name}
            </div>
            <div className="profile-meta-row">
              <span><FiMail /> {hrData?.email}</span>
              {hrData?.phone && <span><FiPhone /> {hrData?.phone}</span>}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsEditProfileOpen(true)}
          style={{
            background: 'var(--secondary-gradient)',
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
          <FiEdit3 /> Edit Recruiter Info
        </button>
      </div>

      {/* Company Info */}
      <div className="profile-section-card">
        <div className="section-header-row">
          <h2 className="section-title">Company Organization Details</h2>
          <button className="section-link" onClick={() => setIsEditCompanyOpen(true)} style={{ color: 'var(--secondary)' }}>
            Edit Company
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{company.name || hrData?.company_name}</h3>
          {company.location && <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}><FiMapPin /> {company.location}</div>}
          {company.website && (
            <a href={company.website} target="_blank" rel="noreferrer" style={{ fontSize: '14px', color: 'var(--secondary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiGlobe /> {company.website}
            </a>
          )}
          <p style={{ fontSize: '15px', color: 'var(--text-main)', marginTop: '8px', lineHeight: '1.7' }}>
            {company.description || 'No detailed company description added yet.'}
          </p>
        </div>
      </div>

      {/* Edit HR Modal */}
      <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="Edit Recruiter Details">
        <form onSubmit={handleUpdateProfile}>
          <div className="auth-form-group">
            <label className="auth-label">Recruiter Name</label>
            <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Company Name</label>
            <input type="text" value={profileForm.company_name} onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Recruiter Role Title</label>
            <input type="text" value={profileForm.company_role} onChange={(e) => setProfileForm({ ...profileForm, company_role: e.target.value })} className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Phone Number</label>
            <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <button type="submit" className="auth-submit-btn" style={{ background: 'var(--secondary-gradient)' }}>Save HR Details</button>
        </form>
      </Modal>

      {/* Edit Company Modal */}
      <Modal isOpen={isEditCompanyOpen} onClose={() => setIsEditCompanyOpen(false)} title="Edit Company Details">
        <form onSubmit={handleUpdateCompany}>
          <div className="auth-form-group">
            <label className="auth-label">Company Name</label>
            <input type="text" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} required className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Website URL</label>
            <input type="url" value={companyForm.website} onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })} className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Location / HQ</label>
            <input type="text" value={companyForm.location} onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })} className="auth-input" style={{ paddingLeft: '16px' }} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Company Overview</label>
            <textarea rows="5" value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} className="auth-input" style={{ padding: '12px' }} />
          </div>
          <button type="submit" className="auth-submit-btn" style={{ background: 'var(--secondary-gradient)' }}>Save Company Specs</button>
        </form>
      </Modal>
    </div>
  );
};

export default HRProfile;

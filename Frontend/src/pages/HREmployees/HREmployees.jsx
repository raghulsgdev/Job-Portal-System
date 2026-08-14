import React, { useState, useEffect } from 'react';
import { FiUserCheck, FiMail, FiPhone, FiFileText } from 'react-icons/fi';
import api from '../../services/api';
import './HREmployees.css';

const HREmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/hr/employees');
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading employee roster...</div>;

  return (
    <div className="employees-container animate-fade">
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>Hired Candidates & Employees</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Roster of accepted talent placed into your company roles.</p>
      </div>

      <div className="employees-card">
        {employees.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No hired employees recorded yet. Accept candidate applications to place them into the roster.
          </div>
        ) : (
          <table className="mgmt-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Contact Info</th>
                <th>Role Hired For</th>
                <th>Category</th>
                <th>Placement Date</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.application_id}>
                  <td>
                    <div style={{ fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiUserCheck style={{ color: 'var(--status-accepted)' }} /> {emp.name}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}><FiMail /> {emp.email}</div>
                    {emp.phone && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}><FiPhone /> {emp.phone}</div>}
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{emp.job_title}</td>
                  <td><span className="job-tag">{emp.category}</span></td>
                  <td>{new Date(emp.hire_date).toLocaleDateString()}</td>
                  <td>
                    {emp.resume_url ? (
                      <a href={emp.resume_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '12px' }}>
                        View Resume
                      </a>
                    ) : (
                      'N/A'
                    )}
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

export default HREmployees;

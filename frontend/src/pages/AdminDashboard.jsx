import { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/api/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/complaints/${id}/status`, { status });
      fetchComplaints();
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>All System Complaints</h2>
      <div className="glass-card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Student Email</th>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem', color: 'var(--primary-color)' }}>{c.complaint_id}</td>
                <td style={{ padding: '1rem' }}>{c.student_email}</td>
                <td style={{ padding: '1rem' }}>{c.title}</td>
                <td style={{ padding: '1rem' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge badge-${c.status.replace(' ', '')}`}>{c.status}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <select 
                    className="form-input" 
                    style={{ padding: '0.4rem', width: 'auto' }}
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {complaints.length === 0 && <div style={{ padding: '2rem', textAlign: 'center' }}>No complaints found.</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;

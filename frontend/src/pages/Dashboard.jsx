import { useState, useEffect } from 'react';
import api from '../api';

const Dashboard = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/api/complaints/my');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/complaints', { title, description });
      setTitle('');
      setDescription('');
      fetchComplaints();
      alert('Complaint submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit');
    }
  };

  return (
    <div className="grid-2">
      <div className="glass-card">
        <h2>Submit New Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Title</label>
            <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="4" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary">File Complaint</button>
        </form>
      </div>

      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>My Recent Complaints</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {complaints.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No complaints recorded yet.</p> : null}
          {complaints.map(c => (
            <div key={c.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{c.complaint_id}</span>
                <span className={`badge badge-${c.status.replace(' ', '')}`}>{c.status}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '0' }}>{c.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {c.description.substring(0, 80)}{c.description.length > 80 ? '...' : ''}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                Filed: {new Date(c.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

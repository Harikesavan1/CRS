import { useState } from 'react';
import api from '../api';
import { Search } from 'lucide-react';

const TrackComplaint = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setResult(null);
      const res = await api.get(`/api/complaints/track/${query}`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to track complaint');
    }
  };

  return (
    <div className="flex-center min-h-screen" style={{ marginTop: '-80px', flexDirection: 'column' }}>
      <div className="glass-card" style={{ width: '500px', marginBottom: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Track Complaint Status</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Enter Complaint ID (e.g. COMP-12345)" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
            <Search size={20} />
          </button>
        </form>
      </div>

      {error && <div className="glass-card" style={{ width: '500px', borderColor: 'var(--danger)', color: 'var(--danger)' }}>{error}</div>}

      {result && (
        <div className="glass-card" style={{ width: '500px' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>{result.complaint_id}</h3>
            <span className={`badge badge-${result.status.replace(' ', '')}`}>{result.status}</span>
          </div>
          <h4 style={{ marginBottom: '0.5rem' }}>{result.title}</h4>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>{result.description}</p>
          <div style={{ fontSize: '0.85rem', color: 'gray' }}>
            Submitted on {new Date(result.created_at).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackComplaint;

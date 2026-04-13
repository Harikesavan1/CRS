import { Link } from 'react-router-dom';
import { Megaphone, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar container">
      <Link to="/" className="nav-brand">
        <Megaphone size={32} color="#ec4899" style={{ transform: 'rotate(-10deg)' }} />
        Complaint Register System
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <Link to="/admin">Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/dashboard">My Complaints</Link>
                <Link to="/track">Track</Link>
              </>
            )}
            <button onClick={onLogout} className="btn btn-secondary">
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

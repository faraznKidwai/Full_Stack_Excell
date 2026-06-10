import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, Database } from 'lucide-react';
import '.././App.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
  const response = await fetch('http://localhost:5000/api/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // ⚠️ CRITICAL FIX: Allows cookies to be saved locally
  body: JSON.stringify({ username, password }),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Successful login redirect
      if (data.success) {
        navigate('/admin-dashboard'); 
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card fade-in">
        
        {/* Branding Area */}
        <div className="login-header">
     
          <h1 className="login-title">Zam Zam Screener Manager</h1>
          <p className="login-subtitle">Sign in to access database </p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="login-error-alert">
            <AlertCircle size={16} className="error-alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-with-icon-wrapper">
              <User size={16} className="input-field-icon" />
              <input
                type="text"
                className="login-text-input"
                placeholder="Enter your admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon-wrapper">
              <Lock size={16} className="input-field-icon" />
              <input
                type="password"
                className="login-text-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="login-submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

     
      </div>
    </div>
  );
};

export default AdminLogin;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('session_token', data.token);
      localStorage.setItem('student_id', data.student_id);
      localStorage.setItem('student_name', data.full_name);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container fade-in">
      <div className="login-card">
        <div className="brand">
          <div className="logo-wrapper">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h1>Parent Portal</h1>
          <p>Advanced Academic Monitoring</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="error-message fade-in">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <div className="input-icon">👤</div>
            <input
              type="text"
              placeholder="Student ID (e.g. STU001)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon">🔒</div>
            <input
              type="password"
              placeholder="Portal Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Secure Access'}
          </button>
        </form>

        <div style={{marginTop: '30px', color: 'var(--text-muted)', fontSize: '13px', borderTop: '1px solid var(--panel-border)', paddingTop: '20px'}}>
          Demo: STU001 / pass123
        </div>
      </div>
    </div>
  );
};

export default Login;

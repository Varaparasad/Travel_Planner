import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AuthForm.css'; // Shared CSS for auth forms

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signup, isLoading, error } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const success = await signup(username, password);
    if (success) {
      // On success, show message and redirect to login
      setMessage('Signup successful! Please log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <main className="card auth-card">
      <h2 className="auth-title">Create Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-style"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-style"
          />
        </div>
        
        <div className="button-container">
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Creating...' : 'Sign Up'}
          </button>
        </div>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {message && (
          <div className="success-box">
            {message}
          </div>
        )}

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default SignupPage;
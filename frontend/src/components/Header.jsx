import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Header.css'; // Import component styles

const Header = () => {
  const { isAuthenticated, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-title">
          <Link to="/" className="header-link">
            <span className="header-brand-text">LangGraph</span> AI Trip Planner
          </Link>
        </h1>
        <nav className="header-nav">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="header-button logout">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="header-button login">
                Login
              </Link>
              <Link to="/signup" className="header-button signup">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
      <p className="header-subtitle">FastAPI + React + LangGraph</p>
    </header>
  );
};

export default Header;
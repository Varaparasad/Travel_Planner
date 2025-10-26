import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// --- API URLs ---
const API_BASE_URL = 'http://127.0.0.1:5000';
const LOGIN_URL = `${API_BASE_URL}/token`;
const SIGNUP_URL = `${API_BASE_URL}/register`;
const PLAN_URL = `${API_BASE_URL}/generate-plan`;

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // --- STATE ---
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New Auth State
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token); // True if token exists

  // --- PRIVATE HELPERS ---
  const _handleApiError = (err) => {
    const errorMsg = err.response?.data?.detail || err.message || "An unknown error occurred.";
    setError(errorMsg);
    setIsLoading(false);
    return false; // Indicate failure
  };

  /**
   * Formats data for FastAPI's OAuth2PasswordRequestForm
   * which expects 'application/x-www-form-urlencoded'
   */
  const _getAuthFormData = (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return formData;
  };
  
  const _getAuthHeaders = () => {
    return { 'Content-Type': 'application/x-www-form-urlencoded' };
  };

  // --- AUTH FUNCTIONS ---
  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = _getAuthFormData(username, password);
      const response = await axios.post(LOGIN_URL, formData, { 
        headers: _getAuthHeaders() 
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true; // Success
      
    } catch (err) {
      return _handleApiError(err);
    }
  };

  const signup = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = _getAuthFormData(username, password);
      await axios.post(SIGNUP_URL, formData, { 
        headers: _getAuthHeaders() 
      });
      setIsLoading(false);
      return true; // Success
      
    } catch (err) {
      return _handleApiError(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setItinerary(null); // Clear any plan data
  };

  // --- PLAN FUNCTION (MODIFIED) ---
  const generatePlan = async (formData) => {
    if (!isAuthenticated) {
      setError("You must be logged in to create a plan.");
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const response = await axios.post(PLAN_URL, formData, {
        headers: {
          'Authorization': `Bearer ${token}` // Add the auth token here
        }
      });
      console.log('Plan response:', response.data.itinerary);
      setItinerary(response.data.itinerary);
      setIsLoading(false);
      return true; // Success
      
    } catch (err) {
      return _handleApiError(err);
    }
  };

  const value = {
    // Plan state
    itinerary,
    isLoading,
    error,
    generatePlan,
    clearPlan: () => setItinerary(null),
    
    // Auth state
    isAuthenticated,
    token,
    login,
    signup,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
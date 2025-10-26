import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import './HomePage.css'; // Import page-specific styles

// Helper to format date
const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return '';
    return date.toISOString().split('T')[0];
};

// Set default dates
const today = new Date();
const start = new Date(today);
start.setDate(today.getDate() + 14);
const end = new Date(start);
end.setDate(start.getDate() + 5);

const defaultFormState = {
  destination: "Kyoto, Japan",
  from_location: "New York, USA",
  start_date: formatDate(start),
  end_date: formatDate(end),
  people: 2,
  trip_type: "Couple Getaway",
  group_details: "We love history, quiet gardens, and traditional food, but dislike large crowds.",
  min_budget: 2000,
  max_budget: 4500
};

const HomePage = () => {
  const [formData, setFormData] = useState(defaultFormState);
  const { generatePlan, isLoading, error } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await generatePlan(formData);
    if (success) {
      navigate('/plan');
    }
  };

  return (
    <main className="card">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="info-box">
          <strong>Plan Your Next Adventure:</strong> Fill out the details below, and our AI agent will build a custom itinerary for you.
        </div>

        {/* --- Section 1: Logistics --- */}
        <section className="form-section">
          <h2 className="form-section-title">1. Travel Dates & Logistics</h2>
          <div className="grid grid-cols-4">
            <div className="form-group grid-span-2">
              <label htmlFor="destination">Destination</label>
              <input type="text" name="destination" id="destination" value={formData.destination} onChange={handleChange} required className="input-style" />
            </div>
            <div className="form-group grid-span-2">
              <label htmlFor="from_location">Departure Location</label>
              <input type="text" name="from_location" id="from_location" value={formData.from_location} onChange={handleChange} required className="input-style" />
            </div>
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input type="date" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} required className="input-style" />
            </div>
            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input type="date" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} required className="input-style" />
            </div>
          </div>
        </section>

        {/* --- Section 2: Group Details --- */}
        <section className="form-section">
           <h2 className="form-section-title">2. Traveler Details</h2>
            <div className="grid grid-cols-4">
                <div className="form-group">
                    <label htmlFor="people">Travelers</label>
                    <input type="number" name="people" id="people" value={formData.people} onChange={handleChange} min="1" required className="input-style" />
                </div>
                <div className="form-group">
                    <label htmlFor="trip_type">Trip Type</label>
                    <select name="trip_type" id="trip_type" value={formData.trip_type} onChange={handleChange} required className="input-style">
                        <option value="Solo">Solo Traveler</option>
                        <option value="Friends Group">Group of Friends</option>
                        <option value="Family Trip">Family Trip</option>
                        <option value="Couple Getaway">Couple Getaway</option>
                    </select>
                </div>
                <div className="form-group grid-span-2">
                    <label htmlFor="group_details">Interests & Requirements</label>
                    <input type="text" name="group_details" id="group_details" value={formData.group_details} onChange={handleChange} placeholder="e.g., Hiking, museums, kid-friendly" className="input-style" />
                </div>
            </div>
        </section>
        
        {/* --- Section 3: Budget --- */}
        <section className="form-section">
            <h2 className="form-section-title">3. Budget (Local Costs in USD)</h2>
            <div className="grid grid-cols-2">
                <div className="form-group">
                    <label htmlFor="min_budget">Minimum Budget (USD)</label>
                    <input type="number" name="min_budget" id="min_budget" value={formData.min_budget} onChange={handleChange} min="0" required className="input-style" />
                </div>
                <div className="form-group">
                    <label htmlFor="max_budget">Maximum Budget (USD)</label>
                    <input type="number" name="max_budget" id="max_budget" value={formData.max_budget} onChange={handleChange} min="0" required className="input-style" />
                </div>
            </div>
        </section>

        {/* --- Action Button --- */}
        <div className="button-container">
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Generating...' : 'Generate Live Trip Plan'}
          </button>
          
          {isLoading && (
            <div className="loading-text">
               <div className="spinner"></div>
                Connecting to agent... this may take a moment.
            </div>
          )}

          {error && (
            <div className="error-box">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </form>
    </main>
  );
};

export default HomePage;
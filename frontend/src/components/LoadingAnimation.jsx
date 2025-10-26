import React from 'react';
import './LoadingAnimation.css'; // Import component styles

// We'll use simple text/divs for the animation
// If you want icons, you'd need an icon library like `react-icons`

const LoadingAnimation = () => {
  return (
    <div className="loading-container card">
      <div className="animation-wrapper">
        <div className="icon plane animate-pulse-fade" style={{ animationDelay: '0s' }}>✈️</div>
        <div className="icon map animate-pulse-fade" style={{ animationDelay: '0.5s' }}>🗺️</div>
        <div className="icon hotel animate-pulse-fade" style={{ animationDelay: '1s' }}>🏨</div>
        <div className="icon sun animate-pulse-fade" style={{ animationDelay: '1.5s' }}>☀️</div>
      </div>
      <h2 className="loading-title">Building Your Itinerary...</h2>
      <p className="loading-subtitle">Our AI agent is fetching data and crafting your perfect trip.</p>
    </div>
  );
};

export default LoadingAnimation;
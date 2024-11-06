import React from 'react';
import './Homepage.css';

const Homepage = ({ onLogout }) => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to DancingPoint</h1>
        <p>Your hub for dance auditions, connections, and opportunities!</p>
        <button onClick={onLogout}>Logout</button>
      </header>
    </div>
  );
};

export default Homepage;

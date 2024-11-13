import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import headerlogo from '../Assets/header-logo.png';
import backgroundImage from '../Assets/week2.png';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="background-image-container"></div>
      <header>
        <a href="#" className="logo">
          <img src={headerlogo} alt="" className="logo-img" />
        </a>
        <div className="header-links">
          <Link to="/login" className="login">
            <button>Login</button>
          </Link>
        </div>
      </header>
      <main>
        <h1></h1>
      </main>
    </div>
  );
}

export default LandingPage;

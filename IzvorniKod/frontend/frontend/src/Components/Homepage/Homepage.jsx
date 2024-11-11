import React from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';
import headerlogo from '../Assets/header-logo.png';

const Homepage = ({ onLogout }) => {
  return (
    <div className="homepage-container">
      <header className='homepage-header'>
        <a href="#" className='logo'>
          <img src={headerlogo} alt="" className='logo-img'/>
        </a>

        <div className='header-links'>
          <Link to="/myprofile" className='login'>
            <button>My Profile</button>
          </Link>
          <Link to="/logout" className='logout'>
            <button>Log Out</button>
          </Link>
        </div>
          
      </header>
      {/* Other homepage content */}
    </div>
  );
};

export default Homepage;
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import headerlogo from '../Assets/header-logo.png';

function LandingPage() {
  return (
    <div className='landing-container'>
      <header>
        <a href="#" className='logo'>
          <img src={headerlogo} alt="" className='logo-img'/>
        </a>

        <div className='header-links'>
          <Link to="/login" className='login'>
            <button>Login</button>
          </Link>
        </div>
          
      </header>

      <main>
        <h1>Dobrodošli u SkyDancers aplikaciju!</h1>
      </main>
    </div>
  );
}

export default LandingPage;
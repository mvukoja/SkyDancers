import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Offers.css';
import headerlogo from '../Assets/header-logo.png';

const DirectorOffers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('http://localhost:8080/offer/director', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Nije moguće dohvatiti ponude');
        }

        const data = await response.json();
        setOffers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div>
      <header>
        <a href="/" className='logo'>
          <img src={headerlogo} alt="" className='logo-img'/>
        </a>
        <div className='header-links'>
          <Link to="/myprofile" className='login'>
            <button>Moj profil</button>
          </Link>
          <Link to="/logout" className='logout'>
            <button>Odjava</button>
          </Link>
        </div>
      </header>

      <div className="offers-container">
        <h2>Poslane ponude</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="offers-list">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <p><strong>Plesač:</strong> {offer.dancerName}</p>
              <p><strong>Poruka:</strong> {offer.message}</p>
              <p><strong>Status:</strong> {offer.status}</p>
              <p><strong>Datum:</strong> {new Date(offer.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {offers.length === 0 && <p>Nema poslanih ponuda.</p>}
        </div>
      </div>
    </div>
  );
};

export default DirectorOffers; 
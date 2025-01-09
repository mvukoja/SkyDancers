import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';
import { Link } from 'react-router-dom';
import headerlogo from '../Assets/header-logo.png';
import { jwtDecode } from 'jwt-decode';

const Homepage = ({ onLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  const getUsernameFromToken = () => {
      const token = localStorage.getItem('jwtToken'); // Dohvati token iz localStorage
      if (!token) return null; // Ako token ne postoji, vrati null
  
      try {
        const decodedToken = jwtDecode(token); // Dekodiraj token
        return decodedToken.sub; // Vratiti korisničko ime iz dekodiranog tokena (prilagoditi prema strukturi tokena)
      } catch (error) {
        console.error('Greška pri dekodiranju tokena:', error);
        return null; // Ako dekodiranje ne uspije, vrati null
      }
    };

  useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem('jwtToken'); // Dohvati token iz localStorage
        if (!token) {
          navigate('/', { replace: true }); // Ako token ne postoji, preusmjeri na početnu stranicu
          return;
        }
  
        let username = getUsernameFromToken(); // Pokušaj izdvojiti korisničko ime iz tokena
  
  
        try {
          const response = await fetch('http://localhost:8080/users/myprofile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
            },
          });
  
          if (response.status === 401) {
            onLogout(); // Ako je status 401 (neautorizirano), pozovi funkciju za odjavu
            navigate('/', { replace: true }); // Preusmjeri na početnu stranicu
            return;
          }
  
          if (!response.ok) {
            throw new Error('Greška pri dohvaćanju podataka profila');
          }
  
          const data = await response.json(); // Parsiraj odgovor kao JSON
          data.username = username; // Dodaj korisničko ime u podatke profila
  
          setProfileData(data); // Postavi podatke profila u stanje
        } catch (error) {
          alert("Your token has expired, please login again.");
          onLogout();
          console.error('Greška pri dohvaćanju podataka profila:', error);
        }
      };
  
      fetchProfile(); // Pozovi funkciju za dohvaćanje profila
    }, [navigate, onLogout]); // Ovisnosti useEffect-a (navigate i onLogout)
  
  return (
    <div className="homepage-container">
      <header className='homepage-header'>
        <a href="/" className='logo'>
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

      {profileData?.type === 'DIRECTOR' && (
        <div className='director-notice'>
          <p>Morate izvršiti plaćanje članarine. Posjetite <Link to="/myprofile">svoj proifil</Link> kako biste izvršili uplatu.</p>
        </div>
      )}
      
      {/* Other homepage content */}
    </div>
  );
};

export default Homepage;
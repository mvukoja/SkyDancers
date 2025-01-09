// src/Components/MyProfile/MyProfile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './myprofile.css';
import { Link } from 'react-router-dom';
import headerlogo from '../Assets/header-logo.png';
import { jwtDecode } from 'jwt-decode';

const MyProfile = ({ onLogout }) => {
  // Inicijalizacija stanja komponente
  const [profileData, setProfileData] = useState(null); // Pohranjuje podatke korisničkog profila
  const [isEditing, setIsEditing] = useState(false); // Kontrolira prikaz forme za uređivanje ili prikaz podataka
  const [formData, setFormData] = useState({}); // Pohranjuje podatke unutar forme za uređivanje
  const [portfolioItems, setPortfolioItems] = useState([]); // Lista stavki u portfoliju korisnika
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]); // Odabrane vrste plesa
  const [inactive, setIsInactive] = useState(false); // Status neaktivnosti korisničkog profila
  const [inactiveUntil, setInactiveUntil] = useState(''); // Datum do kojeg je profil neaktivan

  const navigate = useNavigate(); // Hook za navigaciju između ruta

  // Definicija dostupnih vrsta plesa
  const danceStylesList = [
    'Balet', 'Jazz', 'Hip-Hop', 'Salsa', 'Tango',
    'Valcer', 'Breakdance', 'Suvremeni',
  ];

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:8080/users/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 10000,
          quantity: 1,
          name: 'Godišnja pretplata za direktora',
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        // Redirect to Stripe checkout session URL
        window.location.href = data.sessionUrl;
      } else {
        alert('Došlo je do pogreške prilikom kreiranja sesije plaćanja.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Greška prilikom obrade plaćanja. Pokušajte ponovno.');
    }
  };

  // Funkcija za izdvajanje korisničkog imena iz JWT tokena
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

  // useEffect hook za dohvaćanje podataka profila prilikom montiranja komponente
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
        setFormData(data); // Inicijaliziraj formData s dohvaćenim podacima
        setPortfolioItems(data.portfolio || []); // Postavi portfolio stavke
        setSelectedDanceStyles(data.danceStyles || []); // Postavi odabrane vrste plesa
        setIsInactive(data.inactive || false); // Postavi status neaktivnosti
        setInactiveUntil(data.inactiveUntil || ''); // Postavi datum neaktivnosti
      } catch (error) {
        alert("Your token has expired, please login again.");
        onLogout();
        console.error('Greška pri dohvaćanju podataka profila:', error);
      }
    };

    fetchProfile(); // Pozovi funkciju za dohvaćanje profila
  }, [navigate, onLogout]); // Ovisnosti useEffect-a (navigate i onLogout)

  // Funkcija za prebacivanje između prikaza detalja i forme za uređivanje profila
  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Promijeni status uređivanja
  };

  // Funkcija za rukovanje promjenama unutar forme za uređivanje profila
  const handleChange = (e) => {
    setFormData({
      ...formData, // Zadrži postojeće podatke iz forme
      [e.target.name]: e.target.value, // Ažuriraj vrijednost promijenjenog polja
    });
  };

  // Funkcija za spremanje ažuriranih podataka profila na backend
  const handleSave = async () => {
    const token = localStorage.getItem('jwtToken'); // Dohvati token iz localStorage
    if (!token) {
      navigate('/', { replace: true }); // Ako token ne postoji, preusmjeri na početnu stranicu
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Postavi Content-Type zaglavlje
          'Authorization': `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
        },
        body: JSON.stringify(formData), // Pošalji formData kao JSON
      });

      if (!response.ok) {
        throw new Error('Greška pri ažuriranju profila');
      }

      const updatedData = await response.json(); // Parsiraj odgovor kao JSON
      setProfileData(updatedData); // Ažuriraj podatke profila u stanju
      setIsEditing(false); // Prekini način uređivanja
      alert('Profil uspješno ažuriran'); // Prikaži poruku uspjeha korisniku
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error('Greška pri ažuriranju profila:', error);
    }
  };

  // Funkcija za upload datoteke u portfolio
  const handleFileUpload = async (e) => {
    const token = localStorage.getItem('jwtToken'); // Dohvati token iz localStorage
    const file = e.target.files[0]; // Dohvati odabranu datoteku
    const uploadData = new FormData();
    uploadData.append('file', file); // Dodaj datoteku u FormData

    try {
      const response = await fetch('http://localhost:8080/users/upload-portfolio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
        },
        body: uploadData, // Pošalji FormData kao tijelo zahtjeva
      });

      if (!response.ok) {
        throw new Error('Greška pri uploadu datoteke');
      }

      const newItem = await response.json(); // Parsiraj odgovor kao JSON
      setPortfolioItems([...portfolioItems, newItem]); // Dodaj novu stavku u portfolio
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error('Greška pri uploadu datoteke:', error);
    }
  };

  // Funkcija za brisanje stavke iz portfolia
  const handleDeletePortfolioItem = async (itemId) => {
    const token = localStorage.getItem('jwtToken'); // Dohvati token iz localStorage

    try {
      const response = await fetch(`http://localhost:8080/users/delete-portfolio/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
        },
      });

      if (!response.ok) {
        throw new Error('Greška pri brisanju stavke iz portfolia');
      }

      setPortfolioItems(portfolioItems.filter(item => item.id !== itemId)); // Ukloni stavku iz stanja portfolia
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error('Greška pri brisanju stavke iz portfolia:', error);
    }
  };

  // Funkcija za rukovanje odabirom vrste plesa
  const handleDanceStyleChange = (e) => {
    const value = e.target.value; // Dohvati vrijednost checkboxa
    setSelectedDanceStyles(prevStyles =>
      prevStyles.includes(value)
        ? prevStyles.filter(style => style !== value) // Ako je već odabrano, ukloni ga iz liste
        : [...prevStyles, value] // Inače, dodaj ga u listu
    );
  };

  // Funkcija za spremanje odabranih vrsta plesa na backend
  const saveDanceStyles = async () => {
    const token = localStorage.getItem('jwtToken'); // Dohvati token iz localStorage

    try {
      const response = await fetch('http://localhost:8080/users/update-dance-styles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Postavi Content-Type zaglavlje
          'Authorization': `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
        },
        body: JSON.stringify({ danceStyles: selectedDanceStyles }), // Pošalji odabrane vrste plesa kao JSON
      });

      if (!response.ok) {
        throw new Error('Greška pri ažuriranju vrsta plesa');
      }

      alert('Vrste plesa uspješno ažurirane'); // Prikaži poruku uspjeha korisniku
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error('Greška pri ažuriranju vrsta plesa:', error);
    }
  };

  // Funkcija za promjenu statusa neaktivnosti profila
  const handleInactiveChange = () => {
    setIsInactive(!inactive); // Prebaci status neaktivnosti
  };

  // Funkcija za spremanje statusa neaktivnosti na backend
  const saveInactiveStatus = async () => {
    const token = localStorage.getItem('jwtToken'); // Dohvati token iz localStorage

    try {
      const response = await fetch('http://localhost:8080/users/update-inactive-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Postavi Content-Type zaglavlje
          'Authorization': `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
        },
        body: JSON.stringify({ inactive, inactiveUntil }), // Pošalji status i datum neaktivnosti kao JSON
      });

      if (!response.ok) {
        throw new Error('Greška pri ažuriranju statusa profila');
      }

      alert('Status profila uspješno ažuriran'); // Prikaži poruku uspjeha korisniku
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error('Greška pri ažuriranju statusa profila:', error);
    }
  };

  // Ako podaci profila nisu dohvaćeni, prikazi poruku o učitavanju
  if (!profileData) {
    return <div>Učitavam profil...</div>;
  }

  return (
    <div className="profile-container">
      <header className='homepage-header'>
        <a href="/" className='logo'>
          <img src={headerlogo} alt="" className='logo-img'/>
        </a>

        <div className='header-links'>
          <Link to="/" className='login'>
            <button>Home</button>
          </Link>
          <Link to="/logout" className='logout'>
            <button>Log Out</button>
          </Link>
        </div>
          
      </header>
      <h2>Moj Profil</h2>

      {profileData?.type === 'DIRECTOR' && (
        <div className='payment-section'>
          <button className='payment-button' onClick={handlePayment}>
            Plati članarinu
          </button>
        </div>
      )}

      {/* Prikaz detalja profila ili forme za uređivanje */}
      {isEditing ? (
        <div className="profile-edit-form">
          {/* Polje za unos imena */}
          <label>
            Ime:
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </label>
          {/* Polje za unos prezimena */}
          <label>
            Prezime:
            <input
              type="text"
              name="surname"
              value={formData.surname || ''}
              onChange={handleChange}
            />
          </label>
          {/* Polje za unos lokacije */}
          <label>
            Lokacija:
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
            />
          </label>
          {/* Polje za unos dobi */}
          <label>
            Dob:
            <input
              type="number"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
            />
          </label>
          {/* Dropdown za odabir spola */}
          <label>
            Spol:
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
            >
              <option value="">Odaberite</option>
              <option value="M">Muško</option>
              <option value="F">Žensko</option>
              <option value="O">Ostalo</option>
            </select>
          </label>
          {/* Dugme za spremanje promjena */}
          <button class="buttons" onClick={handleSave}>Spremi</button>
          {/* Dugme za odustajanje od uređivanja */}
          <button class="buttons" onClick={handleEditToggle}>Odustani</button>
        </div>
      ) : (
        <div className="profile-details">
          {/* Prikaz podataka korisničkog profila */}
          <p><strong>Korisničko ime:</strong> {profileData.username}</p>
          <p><strong>Ime:</strong> {profileData.name}</p>
          <p><strong>Prezime:</strong> {profileData.surname}</p>
          <p><strong>Lokacija:</strong> {profileData.location}</p>
          <p><strong>Dob:</strong> {profileData.age}</p>
          <p><strong>Spol:</strong> {profileData.gender}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Tip korisnika:</strong> {profileData.type}</p>
          {/* Dugme za prelazak u način uređivanja */}
          <button onClick={handleEditToggle}>Uredi Profil</button>
        </div>
      )}

      {/* Sekcija za odabir vrsta plesa */}
      {profileData?.type === 'DANCER' && (
        <div className="dance-styles-section">
        <h3>Vrste plesa</h3>
        <div className="dance-styles-list">
          {/* Iteracija kroz listu vrsta plesa i prikaz checkboxa za svaku */}
          {danceStylesList.map(style => (
            <label key={style}>
              <input
                type="checkbox"
                value={style}
                checked={selectedDanceStyles.includes(style)}
                onChange={handleDanceStyleChange}
              />
              {style}
            </label>
          ))}
        </div>
        {/* Dugme za spremanje odabranih vrsta plesa */}
        <button onClick={saveDanceStyles}>Spremi Vrste Plesa</button>
      </div>
      )}
      
      {/* Sekcija za postavljanje statusa neaktivnosti */}
      {profileData?.type === 'DANCER' && (
        <div className="inactive-section">
        <h3>Status profila</h3>
        <label>
          <input
            type="checkbox"
            checked={inactive}
            onChange={handleInactiveChange}
          />
          Neaktivan
        </label>
        {/* Ako je profil označen kao neaktivan, prikazi opciju za odabir datuma */}
        {inactive && (
          <div>
            <label>
              Neaktivan do:
              <input
                type="date"
                value={inactiveUntil}
                onChange={(e) => setInactiveUntil(e.target.value)}
              />
            </label>
          </div>
        )}
        {/* Dugme za spremanje statusa neaktivnosti */}
        <button onClick={saveInactiveStatus}>Spremi Status</button>
      </div>
      )}
      
      {/* Sekcija za upravljanje portfoliom */}
      {profileData?.type === 'DANCER' && (
        <div className="portfolio-section">
        <h3>Moj Portfolio</h3>
        {/* Input za upload slike ili videozapisa */}
        <input type="file" accept="image/*,video/*" onChange={handleFileUpload} />
        <div className="portfolio-items">
          {/* Iteracija kroz listu portfolio stavki i prikaz svake */}
          {portfolioItems.map(item => (
            <div key={item.id} className="portfolio-item">
              {/* Prikaz slike ili videozapisa ovisno o tipu stavke */}
              {item.type.startsWith('image') ? (
                <img src={item.url} alt="Portfolio" />
              ) : (
                <video src={item.url} controls />
              )}
              {/* Dugme za brisanje portfolio stavke */}
              <button onClick={() => handleDeletePortfolioItem(item.id)}>Obriši</button>
            </div>
          ))}
        </div>
      </div>
      )}
      
      {/* Dugme za odjavu korisnika */}
      <button className="logout-button" onClick={onLogout}>Odjava</button>
    </div>
  );
};

export default MyProfile;

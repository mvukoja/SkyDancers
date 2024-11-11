// src/Components/MyProfile/MyProfile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './myprofile.css';
import { jwtDecode } from 'jwt-decode';



const MyProfile = ({ onLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
  const [isInactive, setIsInactive] = useState(false);
  const [inactiveUntil, setInactiveUntil] = useState('');
  
  const navigate = useNavigate();

  const danceStylesList = [
    'Balet', 'Jazz', 'Hip-Hop', 'Salsa', 'Tango',
    'Valcer', 'Breakdance', 'Suvremeni',
  ];

// Function to extract username from JWT token
const getUsernameFromToken = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;
  
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub; // Adjust according to your JWT payload structure
    } catch (error) {
      console.error('Greška pri dekodiranju tokena:', error);
      return null;
    }
  };
  

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      let username = getUsernameFromToken();

      if (!username) {
        // If username is not in token, fetch it from backend
        try {
          const usernameResponse = await fetch('http://localhost:8080/users/get-username', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!usernameResponse.ok) {
            throw new Error('Greška pri dohvaćanju korisničkog imena');
          }

          username = await usernameResponse.text();
        } catch (error) {
          console.error('Greška pri dohvaćanju korisničkog imena:', error);
          return;
        }
      }

      try {
        const response = await fetch('http://localhost:8080/users/myprofile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          onLogout();
          navigate('/', { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error('Greška pri dohvaćanju podataka profila');
        }

        const data = await response.json();
        data.username = username; // Add username to profile data

        setProfileData(data);
        setFormData(data); // Initialize formData with fetched data
        setPortfolioItems(data.portfolio || []);
        setSelectedDanceStyles(data.danceStyles || []);
        setIsInactive(data.isInactive || false);
        setInactiveUntil(data.inactiveUntil || '');
      } catch (error) {
        console.error('Greška pri dohvaćanju podataka profila:', error);
      }
    };

    fetchProfile();
  }, [navigate, onLogout]);



  // Handle toggling edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes in the edit form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save updated profile data
  const handleSave = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Greška pri ažuriranju profila');
      }

      const updatedData = await response.json();
      setProfileData(updatedData);
      setIsEditing(false);
      alert('Profil uspješno ažuriran');
    } catch (error) {
      console.error('Greška pri ažuriranju profila:', error);
    }
  };

  // Handle file upload for portfolio
  const handleFileUpload = async (e) => {
    const token = localStorage.getItem('jwtToken');
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/users/upload-portfolio', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error('Greška pri uploadu datoteke');
      }

      const newItem = await response.json();
      setPortfolioItems([...portfolioItems, newItem]);
    } catch (error) {
      console.error('Greška pri uploadu datoteke:', error);
    }
  };

  // Delete portfolio item
  const handleDeletePortfolioItem = async (itemId) => {
    const token = localStorage.getItem('jwtToken');

    try {
      const response = await fetch(`http://localhost:8080/users/delete-portfolio/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Greška pri brisanju stavke iz portfolia');
      }

      setPortfolioItems(portfolioItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Greška pri brisanju stavke iz portfolia:', error);
    }
  };

  // Handle dance style selection
  const handleDanceStyleChange = (e) => {
    const value = e.target.value;
    setSelectedDanceStyles(prevStyles =>
      prevStyles.includes(value)
        ? prevStyles.filter(style => style !== value)
        : [...prevStyles, value]
    );
  };

  // Save selected dance styles
  const saveDanceStyles = async () => {
    const token = localStorage.getItem('jwtToken');

    try {
      const response = await fetch('http://localhost:8080/users/update-dance-styles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ danceStyles: selectedDanceStyles }),
      });

      if (!response.ok) {
        throw new Error('Greška pri ažuriranju vrsta plesa');
      }

      alert('Vrste plesa uspješno ažurirane');
    } catch (error) {
      console.error('Greška pri ažuriranju vrsta plesa:', error);
    }
  };

  // Handle inactive status change
  const handleInactiveChange = () => {
    setIsInactive(!isInactive);
  };

  // Save inactive status
  const saveInactiveStatus = async () => {
    const token = localStorage.getItem('jwtToken');

    try {
      const response = await fetch('http://localhost:8080/users/update-inactive-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isInactive, inactiveUntil }),
      });

      if (!response.ok) {
        throw new Error('Greška pri ažuriranju statusa profila');
      }

      alert('Status profila uspješno ažuriran');
    } catch (error) {
      console.error('Greška pri ažuriranju statusa profila:', error);
    }
  };

  if (!profileData) {
    return <div>Učitavam profil...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Moj Profil</h2>

      {/* Profile Details or Edit Form */}
      {isEditing ? (
        <div className="profile-edit-form">
          <label>
            Ime:
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Prezime:
            <input
              type="text"
              name="surname"
              value={formData.surname || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Lokacija:
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Dob:
            <input
              type="number"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
            />
          </label>
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
          <button onClick={handleSave}>Spremi</button>
          <button onClick={handleEditToggle}>Odustani</button>
        </div>
      ) : (
        <div className="profile-details">
          <p><strong>Korisničko ime:</strong> {profileData.username}</p>
          <p><strong>Ime:</strong> {profileData.name}</p>
          <p><strong>Prezime:</strong> {profileData.surname}</p>
          <p><strong>Lokacija:</strong> {profileData.location}</p>
          <p><strong>Dob:</strong> {profileData.age}</p>
          <p><strong>Spol:</strong> {profileData.gender}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Tip korisnika:</strong> {profileData.type}</p>
          <button onClick={handleEditToggle}>Uredi Profil</button>
        </div>
      )}

      {/* Dance Styles Section */}
      <div className="dance-styles-section">
        <h3>Vrste plesa</h3>
        <div className="dance-styles-list">
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
        <button onClick={saveDanceStyles}>Spremi Vrste Plesa</button>
      </div>

      {/* Inactive Status Section */}
      <div className="inactive-section">
        <h3>Status profila</h3>
        <label>
          <input
            type="checkbox"
            checked={isInactive}
            onChange={handleInactiveChange}
          />
          Neaktivan
        </label>
        {isInactive && (
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
        <button onClick={saveInactiveStatus}>Spremi Status</button>
      </div>

      {/* Portfolio Section */}
      <div className="portfolio-section">
        <h3>Moj Portfolio</h3>
        <input type="file" accept="image/*,video/*" onChange={handleFileUpload} />
        <div className="portfolio-items">
          {portfolioItems.map(item => (
            <div key={item.id} className="portfolio-item">
              {item.type.startsWith('image') ? (
                <img src={item.url} alt="Portfolio" />
              ) : (
                <video src={item.url} controls />
              )}
              <button onClick={() => handleDeletePortfolioItem(item.id)}>Obriši</button>
            </div>
          ))}
        </div>
      </div>

      {/* Applications Section */}

      <button className="logout-button" onClick={onLogout}>Odjava</button>
    </div>
  );
};

export default MyProfile;

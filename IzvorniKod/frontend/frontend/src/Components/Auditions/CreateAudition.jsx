import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CreateAudition.css'
import headerlogo from '../Assets/header-logo.png';

const CreateAudition = () => {
  const [formData, setFormData] = useState({
    datetime: '',
    deadline: '',
    location: '',
    description: '',
    positions: '',
    wage: '',
  });

  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
  const navigate = useNavigate();

  const danceStylesList = [
    "Balet",
    "Jazz",
    "Hip-Hop",
    "Salsa",
    "Tango",
    "Valcer",
    "Breakdance",
    "Suvremeni",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDanceStyleChange = (e) => {
    const value = e.target.value;
    setSelectedDanceStyles(prevStyles =>
      prevStyles.includes(value)
        ? prevStyles.filter(style => style !== value)
        : [...prevStyles, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auditionData = {
      ...formData,
      positions: parseInt(formData.positions, 10),
      wage: parseFloat(formData.wage),
      styles: selectedDanceStyles,
      user: {
        id: 1,
      },
    };

    try {
      const response = await fetch('http://localhost:8080/audition/create', 
       {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditionData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Audicija uspješno kreirana!');
        navigate('/');
      } else {
        alert('Došlo je do greške pri kreiranju audicije.');
      }
    } catch (error) {
      console.error('Greška:', error);
      alert('Greška pri povezivanju s poslužiteljem.');
    }
  };

  return (
    <div>
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

      <div className="create-audition-container">
        <h1>Kreiraj novu audiciju</h1>
        <form className="audition-form" onSubmit={handleSubmit}>
          <label>
            Datum i vrijeme:
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Rok prijave:
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Lokacija:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Opis:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Broj pozicija:
            <input
              type="number"
              name="positions"
              value={formData.positions}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Satnica (EUR):
            <input
              type="number"
              name="wage"
              value={formData.wage}
              onChange={handleInputChange}
              required
            />
          </label>
          <div className="dance-styles-section">
            <label>Stilovi plesa:</label>
            <div className="dance-styles-list">
              {danceStylesList.map((style) => (
                <label key={style} className="dance-style-checkbox">
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
          </div>
          <button type="submit" className="create-audition-button">
            Kreiraj audiciju
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAudition;

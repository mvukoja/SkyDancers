import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CreateAudition.css";
import headerlogo from "../Assets/header-logo.png";

//Stranica za kreiranje audicije
const CreateAudition = () => {
  const [formData, setFormData] = useState({
    datetime: "",
    deadline: "",
    location: "",
    description: "",
    positions: "",
    wage: "",
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
    setSelectedDanceStyles((prevStyles) =>
      prevStyles.includes(value)
        ? prevStyles.filter((style) => style !== value)
        : [...prevStyles, value]
    );
  };

  //Funkcija za kreiranje audicije
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDanceStyles.length === 0) {
      alert("Izaberite barem jedan stil plesa.");
      return;
    }
    const auditionData = {
      ...formData,
      positions: parseInt(formData.positions, 10),
      wage: parseFloat(formData.wage),
      styles: selectedDanceStyles,
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:8080/audition/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(auditionData),
      });

      if (response.ok) {
        alert("Audicija uspješno kreirana!");
        const data = await response.json();
        navigate(`/audition/${data.id}`);
      } else {
        alert("Došlo je do greške pri kreiranju audicije.");
      }
    } catch (error) {
      console.error("Greška:", error);
      alert("Greška pri povezivanju s poslužiteljem.");
    }
  };

  return (
    <div>
      <header className="homepage-header">
        <a href="/" className="logo">
          <img src={headerlogo} alt="" className="logo-img" />
        </a>

        <div className="header-links">
          <Link to="/" className="login">
            <button>Početna</button>
          </Link>
          <Link to="/logout" className="logout">
            <button>Odjava</button>
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
              onChange={(e) => {
                const selectedDate = e.target.value;
                const currentDate = new Date().toISOString().slice(0, 16);

                if (selectedDate < currentDate) {
                  alert("Datum i vrijeme ne može biti u prošlosti.");
                  e.target.value = "";
                  return;
                }
                const deadlineValue = formData.deadline;
                if (
                  deadlineValue &&
                  new Date(deadlineValue) > new Date(selectedDate)
                ) {
                  alert("Rok prijave mora biti prije događaja.");
                  e.target.value = "";
                  return;
                }

                handleInputChange(e);
              }}
              required
            />
          </label>

          <label>
            Rok prijave:
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={(e) => {
                const deadlineValue = e.target.value;
                const currentDate = new Date().toISOString().slice(0, 16);

                if (deadlineValue < currentDate) {
                  alert("Rok prijave ne može biti u prošlosti.");
                  e.target.value = "";
                  return;
                }
                const datetimeValue = formData.datetime;
                if (
                  datetimeValue &&
                  new Date(deadlineValue) > new Date(datetimeValue)
                ) {
                  alert("Rok prijave mora biti prije događaja.");
                  e.target.value = "";
                  return;
                }

                handleInputChange(e);
              }}
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
              placeholder="Unesite lokaciju"
              required
            />
          </label>
          <label>
            Opis:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Unesite opis"
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
              placeholder="Unesite broj pozicija"
              required
            />
          </label>
          <label>
            Plaća (EUR):
            <input
              type="number"
              name="wage"
              value={formData.wage}
              onChange={handleInputChange}
              placeholder="Unesite plaću"
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

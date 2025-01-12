import React, { useState } from "react";
import "./SearchDancers.css";
import { useNavigate, Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";

const SearchDancers = () => {
  const [filters, setFilters] = useState({
    ageup: "",
    agedown: "",
    gender: "",
  });
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDanceStyleChange = (e) => {
    const value = e.target.value;
    setSelectedDanceStyles(prevStyles =>
      prevStyles.includes(value)
        ? prevStyles.filter(style => style !== value)
        : [...prevStyles, value]
    );
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      setError("");
      const response = await fetch(
        "http://localhost:8080/users/searchdancers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ageup: parseInt(filters.ageup),
            agedown: parseInt(filters.agedown),
            gender: filters.gender,
            dancestyles: selectedDanceStyles,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Došlo je do greške pri pretrazi.");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Then update your JSX structure:
  return (
    <div>
      <header className="homepage-header">
        <a href="/" className="logo">
          <img src={headerlogo} alt="" className="logo-img" />
        </a>

        <div className="header-links">
          <Link to="/myprofile" className="login">
            <button>My Profile</button>
          </Link>
          <Link to="/logout" className="logout">
            <button>Log Out</button>
          </Link>
        </div>
      </header>

      <div className="search-dancers-container">
        <h2>Pretraga plesača</h2>
        <form className="search-form">
          <div className="form-group">
            <label>Donja granica godina:</label>
            <input
              type="number"
              name="agedown"
              value={filters.agedown}
              onChange={handleChange}
              placeholder="Npr. 10"
            />
          </div>
          <div className="form-group">
            <label>Gornja granica godina:</label>
            <input
              type="number"
              name="ageup"
              value={filters.ageup}
              onChange={handleChange}
              placeholder="Npr. 20"
            />
          </div>
          <div className="form-group">
            <label>Spol:</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
            >
              <option value="">Odaberite spol</option>
              <option value="M">Muški</option>
              <option value="F">Ženski</option>
            </select>
          </div>
          
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

          <button
            type="button"
            onClick={handleSearch}
            className="search-button"
          >
            Pretraži
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <div className="results-section">
          <h3>Rezultati pretrage:</h3>
          {results.length > 0 ? (
            <ul className="results-list">
              {results.map((dancer) => (
                <li key={dancer.id} className="dancer-card">
                  <p>
                    <strong>Ime:</strong> {dancer.name}
                  </p>
                  <p>
                    <strong>Godine:</strong> {dancer.age}
                  </p>
                  <p>
                    <strong>Spol:</strong> {dancer.gender}
                  </p>
                  <p>
                    <strong>Stilovi plesa:</strong>{" "}
                    {dancer.danceStyles?.map(style => style.name).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-results">Nema rezultata pretrage.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDancers;

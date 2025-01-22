import React, { useState } from "react";
import "./SearchDancers.css";
import { useNavigate, Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";

//Stranica za pretragu plesača od strane direktora
const SearchDancers = () => {
  const navigate = useNavigate();
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
    setSelectedDanceStyles((prevStyles) =>
      prevStyles.includes(value)
        ? prevStyles.filter((style) => style !== value)
        : [...prevStyles, value]
    );
  };

  //Funkcija za dohvat plesača po kriterijima
  const handleSearch = async () => {
    try {
      if (selectedDanceStyles.length === 0) {
        alert("Izaberite barem jedan stil plesa.");
        return;
      }
      const token = localStorage.getItem("jwtToken");
      setError("");
      const response = await fetch(
        "https://skydancers-back.onrender.com/users/searchdancers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  const handleDancerClick = (username) => {
    navigate(`/profile/${username}`);
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

      <div className="search-dancers-container">
        <h2>Pretraga plesača</h2>
        <form className="search-form">
          <div className="form-group">
            <label>Donja granica godina:</label>
            <input
              type="number"
              min={0}
              onBlur={(e) => {
                if (e.target.value < 0) {
                  e.target.value = 0;
                }
                if (
                  filters.ageup &&
                  parseInt(e.target.value, 10) >= parseInt(filters.ageup, 10)
                ) {
                  alert("Donja granica mora biti manja od gornje granice.");
                  e.target.value = "";
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
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
              min={1}
              onBlur={(e) => {
                if (e.target.value < 0) {
                  e.target.value = 0;
                }
                if (
                  filters.agedown &&
                  parseInt(e.target.value, 10) <= parseInt(filters.agedown, 10)
                ) {
                  alert("Gornja granica mora biti veća od donje granice.");
                  e.target.value = "";
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
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
                  <div className="dancer-info">
                    <p>
                      <strong id="username">{dancer.username}</strong>
                    </p>
                    <p>
                      <strong>Ime:</strong> {dancer.name}
                    </p>
                    <p>
                      <strong>Godine:</strong>{" "}
                      {dancer.age ? dancer.age : "Nije uneseno"}
                    </p>
                    <p>
                      <strong>Spol:</strong>{" "}
                      {dancer.gender ? dancer.gender : "Nije uneseno"}
                    </p>
                    <p>
                      <strong>Stilovi plesa:</strong>{" "}
                      {dancer.danceStyles
                        ?.map((style) => style.name)
                        .join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDancerClick(dancer.username)}
                    className="view-profile-button"
                  >
                    Pogledaj profil plesača
                  </button>
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

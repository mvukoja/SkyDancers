import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SearchAuditions.css";
import headerlogo from "../Assets/header-logo.png";

//Stranica za pretragu audicija od strane plesača
const SearchAuditions = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({
    datetime: "",
    wage: "",
    location: "",
    styles: [],
  });
  const [auditions, setAuditions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const danceStyles = [
    "Balet",
    "Jazz",
    "Hip-Hop",
    "Salsa",
    "Tango",
    "Valcer",
    "Breakdance",
    "Suvremeni",
  ];
  const handleStyleChange = (style) => {
    setSearchCriteria((prev) => {
      const currentStyles = prev.styles || [];
      if (currentStyles.includes(style)) {
        return {
          ...prev,
          styles: currentStyles.filter((s) => s !== style),
        };
      } else {
        return {
          ...prev,
          styles: [...currentStyles, style],
        };
      }
    });
  };

  //Funkcija za dohvat audicija po kriterijima
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const searchPayload = {
        ...searchCriteria,
        datetime: searchCriteria.datetime || null,
        wage: searchCriteria.wage ? parseInt(searchCriteria.wage) : null,
      };

      const response = await fetch(
        "http://localhost:8080/audition/searchauditions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchPayload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAuditions(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to search auditions");
      }
    } catch (error) {
      console.error("Error searching auditions:", error);
      alert("Greška pri povezivanju s poslužiteljem.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleString("hr-HR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return dateString || "N/A";
    }
  };

  const handleAuditionClick = (id) => {
    navigate(`/audition/${id}`);
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

      <div className="search-audition-container">
        <h2>Pretraga audicija</h2>

        <form onSubmit={handleSearch} className="audition-form">
          <div className="form-group">
            <label>Datum i vrijeme (do):</label>
            <input
              type="date"
              value={searchCriteria.datetime}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  datetime: e.target.value,
                }))
              }
            />
          </div>

          <div className="form-group">
            <label>Minimalna plaća (EUR):</label>
            <input
              type="number"
              value={searchCriteria.wage}
              min={0}
              onBlur={(e) => {
                if (e.target.value < 0) {
                  e.target.value = 0;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  wage: e.target.value,
                }))
              }
              placeholder="Unesite minimalnu plaću"
            />
          </div>

          <div className="form-group">
            <label>Lokacija:</label>
            <input
              type="text"
              value={searchCriteria.location}
              onChange={(e) =>
                setSearchCriteria((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="Unesite lokaciju"
            />
          </div>

          <div className="dance-styles-section">
            <label>Stilovi plesa:</label>
            <div className="styles-checkboxes">
              {danceStyles.map((style) => (
                <label key={style} className="dance-style-checkbox">
                  <input
                    type="checkbox"
                    checked={searchCriteria.styles.includes(style)}
                    onChange={() => handleStyleChange(style)}
                  />
                  {style}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="create-audition-button"
          >
            {loading ? "Traženje..." : "Traži"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="auditions-results">
          {auditions.length > 0 ? (
            <div className="auditions-list">
              {auditions.map((audition) => (
                <div key={audition.id} className="audition-card">
                  <div className="audition-header">
                    <h3>Audicija #{audition.id}</h3>
                    <button
                      className="accept-button"
                      onClick={() => handleAuditionClick(audition.id)}
                    >
                      Detaljnije
                    </button>
                    <span className="subscribed-count">
                      Primljeni: {audition.subscribed || 0}/{audition.positions}
                    </span>
                  </div>
                  <div className="audition-details">
                    <p>
                      <strong>Autor: </strong>
                      <Link to={`/profile/${audition.author}`}>
                        {audition.author}
                      </Link>
                    </p>
                    <p>
                      <strong>Datum i vrijeme:</strong>{" "}
                      {formatDate(audition.datetime)}
                    </p>
                    <p>
                      <strong>Plaća (EUR):</strong> {audition.wage}
                    </p>
                    <p>
                      <strong>Opis:</strong> {audition.description}
                    </p>
                    <div className="styles-list">
                      <strong>Stilovi plesa:</strong>
                      {audition.styles && audition.styles.length > 0 ? (
                        audition.styles.map((style, index) => (
                          <span key={index} className="style-tag">
                            {style}
                          </span>
                        ))
                      ) : (
                        <span className="no-styles">
                          Niste izabrali stilove
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">
              <strong>Nijedna audicija ne zadovoljava vaše kriterije.</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAuditions;

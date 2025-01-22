import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./DirectorAuditions.css";
import { useNavigate, Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";

//Stranica za prikaz audicija direktora
const DirectorAuditions = () => {
  const navigate = useNavigate();
  const [auditions, setAuditions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    //Funkcija za dohvat svih audicija
    const fetchAuditions = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const username = decodedToken.sub;
        const url = showArchived
          ? `https://skydancers-back.onrender.com/audition/archived/${username}`
          : `https://skydancers-back.onrender.com/audition/getdirectors/${username}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAuditions(Array.isArray(data) ? data : []);
        } else {
          console.error("Server response not OK:", response.status);
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching auditions:", error);
        setError("Failed to load auditions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditions();
  }, [showArchived]);

  //Funkcija za formatiranje datuma
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

  if (loading) {
    return (
      <div className="director-auditions">
        <h2>Moje audicije</h2>
        <div className="loading">Učitavanje audicija...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="director-auditions">
        <h2>Moje audicije</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const handleAuditionClick = (id) => {
    navigate(`/audition/${id}`);
  };

  const toggleAuditionType = () => {
    setShowArchived(!showArchived);
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
      <div className="director-auditions">
        <h2>{showArchived ? "Arhivirane audicije" : "Moje audicije"}</h2>
        <button className="archive" onClick={toggleAuditionType}>
          {showArchived
            ? "Povratak na aktivne audicije"
            : "Arhivirane audicije"}
        </button>
        {auditions.length === 0 ? (
          <p className="no-auditions">Nemate nijednu audiciju.</p>
        ) : (
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
                    <strong>Lokacija:</strong> {audition.location}
                  </p>
                  <p>
                    <strong>Datum:</strong> {formatDate(audition.datetime)}
                  </p>
                  <p>
                    <strong>Plaća (EUR):</strong> {audition.wage}
                  </p>
                  <p>
                    <strong>Opis:</strong> {audition.description}
                  </p>
                  <div className="styles-list">
                    <strong>Stilovi:</strong>
                    {audition.styles && audition.styles.length > 0 ? (
                      audition.styles.map((style, index) => (
                        <span key={index} className="style-tag">
                          {style}
                        </span>
                      ))
                    ) : (
                      <span className="no-styles">Nema izabranih stilova</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectorAuditions;

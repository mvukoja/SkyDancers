import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import "./SearchResults.css";
import headerlogo from "../Assets/header-logo.png";

const SearchResults = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await fetch(
          `http://localhost:8080/users/searchuser/${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
            },
          }
        );

        if (!response.ok) {
          throw new Error("Greška pri dohvaćanju podataka profila");
        }

        const data = await response.json();
        setSearchResults(data);
        console.log(data);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka profila:", error);
      }
    };
    fetchSearchResults();
  }, [username]);

  const handleUserClick = (username) => {
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
      <div className="search-results-container">
        <h2>Rezultati pretrage za: "{username}"</h2>
        {searchResults.length === 0 ? (
          <p>Nije pronađen nijedan korisnik.</p>
        ) : (
          <div className="results-section">
            <ul className="results-list">
              {searchResults.map((user) => (
                <li key={user.type.userid} className="result-item">
                  <div className="user-info">
                    <p>
                      <strong id="username">{user.username}</strong>
                    </p>
                    <p>
                      <strong>Ime:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Godine:</strong>{" "}
                      {user.age ? user.age : "Nije uneseno"}
                    </p>
                    <p>
                      <strong>Spol:</strong>{" "}
                      {user.gender ? user.gender : "Nije uneseno"}
                    </p>
                    <p>
                      <strong>Vrsta korisnika:</strong>{" "}
                      {user.type.type === "DANCER" ? "Plesač" : "Direktor"}
                    </p>
                    {user.type.type === "DANCER" && (
                      <p>
                        <strong>Stilovi plesa:</strong>{" "}
                        {user.danceStyles?.length > 0
                          ? user.danceStyles
                              ?.map((style) => style.name)
                              .join(", ")
                          : "Nisu uneseni"}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      handleUserClick(user.username);
                    }}
                    className="view-profile-button"
                  >
                    Pogledaj profil
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

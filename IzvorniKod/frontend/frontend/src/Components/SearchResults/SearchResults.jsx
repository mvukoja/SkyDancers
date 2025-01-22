import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import "./SearchResults.css";
import headerlogo from "../Assets/header-logo.png";
import { jwtDecode } from "jwt-decode";

//Stranica za pretragu drugih korisnika
const SearchResults = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
    if (!token) return null; // Ako token ne postoji, vrati null

    try {
      const decodedToken = jwtDecode(token); // Dekodiraj token
      return decodedToken.sub; // Vratiti korisničko ime iz dekodiranog tokena (prilagoditi prema strukturi tokena)
    } catch (error) {
      console.error("Greška pri dekodiranju tokena:", error);
      return null; // Ako dekodiranje ne uspije, vrati null
    }
  };

  useEffect(() => {
    //Dohvat korisnika po ukucanom imenu
    const fetchSearchResults = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await fetch(
          `https://skydancers-back.onrender.com/users/searchuser/${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Greška pri dohvaćanju podataka profila");
        }

        const data = await response.json();
        const filteredData = data.filter(
          (user) => user.username !== getUsernameFromToken()
        );
        setSearchResults(filteredData);
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka profila:", error);
      }
    };
    fetchSearchResults();
  }, [username]);

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      if (searchInput.length < 3) {
        alert("Korisničko ime mora imati barem 3 slova");
        return;
      }
      navigate(`/search-results/${searchInput.trim()}`);
    }
  };

  return (
    <div>
      <header className="homepage-header">
        <a href="/" className="logo">
          <img src={headerlogo} alt="" className="logo-img" />
        </a>

        <div className="header-links">
          <input
            type="text"
            placeholder="Pretraga korisnika..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-bar"
            id="usersearch"
          />
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
                <li key={user.id} className="result-item">
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
                      {user.type.type === "DANCER"
                        ? "Plesač"
                        : user.type.type === "DIRECTOR"
                        ? "Direktor"
                        : "Admin"}
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

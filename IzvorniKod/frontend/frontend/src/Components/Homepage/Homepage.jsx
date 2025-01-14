import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import { Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";
import { jwtDecode } from "jwt-decode";

const Homepage = ({ onLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

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
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
      if (!token) {
        navigate("/", { replace: true }); // Ako token ne postoji, preusmjeri na početnu stranicu
        return;
      }

      let username = getUsernameFromToken(); // Pokušaj izdvojiti korisničko ime iz tokena

      try {
        const response = await fetch("http://localhost:8080/users/myprofile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
          },
        });

        if (response.status === 401) {
          onLogout(); // Ako je status 401 (neautorizirano), pozovi funkciju za odjavu
          navigate("/", { replace: true }); // Preusmjeri na početnu stranicu
          return;
        }

        if (!response.ok) {
          throw new Error("Greška pri dohvaćanju podataka profila");
        }

        const data = await response.json(); // Parsiraj odgovor kao JSON
        data.username = username; // Dodaj korisničko ime u podatke profila

        setProfileData(data); // Postavi podatke profila u stanje
      } catch (error) {
        alert("Your token has expired, please login again.");
        onLogout();
        console.error("Greška pri dohvaćanju podataka profila:", error);
      }
    };

    fetchProfile(); // Pozovi funkciju za dohvaćanje profila
  }, [navigate, onLogout]); // Ovisnosti useEffect-a (navigate i onLogout)

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      navigate(`/search-results/${searchInput.trim()}`);
    }
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <a href="/" className="logo">
          <img src={headerlogo} alt="" className="logo-img" />
        </a>
        <div className="header-links">
          {profileData?.type.type === "DANCER" && (
            <Link to="/notifications" className="notifications">
              <button><img src="../../notification-bell.svg" alt="" style={{ width: "15px", height: "15px" }}/> Obavijesti</button>
            </Link>
          )}
          <input
            type="text"
            placeholder="Pretraga korisnika..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-bar"
            id="usersearch"
          />
          <Link to="/myprofile" className="login">
            <button>Moj profil</button>
          </Link>
          <Link to="/logout" className="logout">
            <button>Odjava</button>
          </Link>
        </div>
      </header>

      {profileData?.type.type === "DIRECTOR" && profileData?.paid === false && (
        <div className="director-notice">
          <p>
            Morate izvršiti plaćanje članarine. Posjetite{" "}
            <Link to="/myprofile">svoj profil</Link> kako biste izvršili uplatu.
          </p>
        </div>
      )}

      <div className="content-container">
        <h1>Dobrodošli na Dance Hub!</h1>
        {profileData?.type.type === "DIRECTOR" ? (
          <div className="button-group">
            <button
              className="navigation-button"
              onClick={() => navigate("/post-audition")}
            >
              Kreiraj audiciju
            </button>
            <button
              className="navigation-button"
              onClick={() => navigate("/my-auditions")}
            >
              Moje audicije
            </button>
            <button
              className="navigation-button"
              onClick={() => navigate("/search-dancers")}
            >
              Pretraga plesača
            </button>
            <button
              className="navigation-button"
              onClick={() => navigate("/director-offers")}
            >
              Pregled poslanih ponuda
            </button>
          </div>
        ) : profileData?.type.type === "DANCER" ? (
          <div className="button-group">
            <button
              className="navigation-button"
              onClick={() => navigate("/search-auditions")}
            >
              Pretraživanje audicija
            </button>
            <button
              className="navigation-button"
              onClick={() => navigate("/chat")}
            >
              Chat s plesačima
            </button>
            <button
              className="navigation-button"
              onClick={() => navigate("/dancer-offers")}
            >
              Pregled primljenih ponuda
            </button>
          </div>
        ) : (
          <p>Molimo prijavite se za pristup funkcionalnostima.</p>
        )}
      </div>
    </div>
  );
};

export default Homepage;

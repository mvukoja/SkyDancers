import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Offers.css";
import headerlogo from "../Assets/header-logo.png";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

//Stranica za pregled direktnih ponuda plesačima
const DancerOffers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");

  //Funkcija za prihvaćanje ponude
  const handleAcceptResponse = async (offerId, state) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `${backendUrl}/offer/accept/${offerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nije moguće ažurirati ponudu");
      }

      // Osvježi listu ponuda
      const updatedOffers = offers.map((offer) =>
        offer.id === offerId ? { ...offer, state } : offer
      );
      setOffers(updatedOffers);
    } catch (err) {
      setError(err.message);
    }
  };

  //Funkcija za odbijanje ponude
  const handleDenyResponse = async (offerId, state) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `${backendUrl}/offer/deny/${offerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nije moguće ažurirati ponudu");
      }

      // Osvježi listu ponuda
      const updatedOffers = offers.map((offer) =>
        offer.id === offerId ? { ...offer, state } : offer
      );
      setOffers(updatedOffers);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    //Funkcija za dohvat svih ponuda
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`${backendUrl}/offer/dancer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Nije moguće dohvatiti ponude");
        }

        const data = await response.json();
        setOffers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div>
      <header>
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

      <div className="offers-container">
        <h2>Primljene ponude</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="offers-list">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <p>
                <strong>Direktor:</strong>{" "}
                <Link to={`/profile/${offer.directorname}`}>
                  {offer.directorname}
                </Link>
              </p>
              <p>
                <strong>Poruka:</strong> {offer.message}
              </p>
              <p>
                <strong>Status:</strong> {offer.state}
              </p>
              <p>
                <strong>Datum:</strong>{" "}
                {new Date(offer.createdAt).toLocaleDateString()}
              </p>
              {offer.state === "U tijeku" && (
                <div className="offer-actions">
                  <button
                    onClick={() => handleAcceptResponse(offer.id, "Prihvaćena")}
                    className="accept-button"
                  >
                    Prihvati
                  </button>
                  <button
                    onClick={() => handleDenyResponse(offer.id, "Odbijena")}
                    className="reject-button"
                  >
                    Odbij
                  </button>
                </div>
              )}
            </div>
          ))}
          {offers.length === 0 && <p>Nema primljenih ponuda.</p>}
        </div>
      </div>
    </div>
  );
};

export default DancerOffers;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Offers.css";
import headerlogo from "../Assets/header-logo.png";

const DirectorOffers = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch("http://localhost:8080/offer/director", {
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

  const handleDelete = async (offerId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8080/offer/delete/${offerId}`,
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
      const updatedOffers = offers.filter((item) =>
        offerId !== item.id
      );
      setOffers(updatedOffers);
    } catch (err) {
      setError(err.message);
    }
  };

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
        <h2>Poslane ponude</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="offers-list">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <p>
                <strong>Plesač:</strong>{" "}
                <Link to={`/profile/${offer.dancername}`}>
                  {offer.dancername}
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
              <button
                className="reject-button"
                onClick={() => handleDelete(offer.id)}
              >
                Ukloni
              </button>
            </div>
          ))}
          {offers.length === 0 && <p>Nema poslanih ponuda.</p>}
        </div>
      </div>
    </div>
  );
};

export default DirectorOffers;

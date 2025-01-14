import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";
import "./UserProfile.css";

const UserProfile = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [offerMessage, setOfferMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch user profile data
        const profileResponse = await fetch(
          `http://localhost:8080/users/get/${username}`,
          { headers }
        );

        if (!profileResponse.ok) {
          throw new Error("Nije moguće dohvatiti profil korisnika.");
        }

        const profileResult = await profileResponse.json();
        setProfileData(profileResult);

        // Fetch portfolio data
        const portfolioResponse = await fetch(
          `http://localhost:8080/portfolio/get/${username}`,
          { headers }
        );

        if (portfolioResponse.ok) {
          const portfolioResult = await portfolioResponse.json();
          setPortfolioData(portfolioResult);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [username]);
  const handleSendOffer = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const body = {
        dancerid: profileData.type.userid,
        message: offerMessage,
      };

      const response = await fetch("http://localhost:8080/offer/make", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Došlo je do greške pri slanju ponude.");
      }
      setConfirmationMessage("Ponuda je uspješno poslana!");
      setShowModal(false);
    } catch (err) {
      setConfirmationMessage(err.message);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profileData) {
    return <div>Učitavanje...</div>;
  }

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

      <div className="profile-container">
        <div className="profile-header">
          <h2>
            {profileData.name} {profileData.surname}
          </h2>
          <span className="user-type">{profileData.type.type}</span>
        </div>

        <div className="profile-sections">
          <div className="profile-details">
            <h3>Osobni podaci</h3>
            <p>
              <strong>Korisničko ime:</strong> {profileData.username}
            </p>
            <p>
              <strong>Ime:</strong> {profileData.name}
            </p>
            <p>
              <strong>Prezime:</strong> {profileData.surname}
            </p>
            <p>
              <strong>Lokacija:</strong>{" "}
              {profileData.location ? profileData.location : "Nije uneseno"}
            </p>
            <p>
              <strong>Dob:</strong>{" "}
              {profileData.age ? profileData.age : "Nije uneseno"}
            </p>
            <p>
              <strong>Spol:</strong>{" "}
              {profileData.gender ? profileData.gender : "Nije uneseno"}
            </p>
            <p>
              <strong>Email:</strong> {profileData.email}
            </p>
            <p>
              <strong>Tip korisnika:</strong>{" "}
              {profileData.type.type === "DANCER" ? "Plesač" : "Direktor"}
            </p>
          </div>

          {profileData.type.type === "DANCER" && (
            <div className="dance-styles">
              <h3>Stilovi plesa:</h3>
              <div className="dance-styles-list">
                {profileData.danceStyles?.length > 0
                  ? profileData.danceStyles?.map((style, index) => (
                      <span key={index} className="dance-style-tag">
                        {style.name}
                      </span>
                    ))
                  : "Nisu uneseni"}
              </div>
            </div>
          )}
        </div>

        {profileData.type.type === "DANCER" && (
          <div className="send-offer-section">
            <button onClick={() => setShowModal(true)}>Pošalji ponudu</button>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Pošalji ponudu</h3>
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Unesite svoju poruku..."
              ></textarea>
              <button onClick={handleSendOffer}>Pošalji</button>
              <button onClick={() => setShowModal(false)}>Zatvori</button>
            </div>
          </div>
        )}

        {/* Poruka potvrde */}
        {confirmationMessage && (
          <div className="confirmation-message">{confirmationMessage}</div>
        )}

{portfolioData && (
          <div className="portfolio-section">
            <h3>Portfolio</h3>

            <div className="portfolio-description">
              <h4>O meni</h4>
              <p>
                {portfolioData.description
                  ? portfolioData.description
                  : "Nije unesen portfolio"}
              </p>
            </div>

            {portfolioData.photos && portfolioData.photos.length > 0 && (
              <div className="portfolio-photos">
                <h4>Fotografije</h4>
                <div className="photo-grid">
                  {portfolioData.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <a
                        href={`http://localhost:8080${photo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`http://localhost:8080${photo}`}
                          alt={`Portfolio photo ${index + 1}`}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {portfolioData.videos && portfolioData.videos.length > 0 && (
              <div className="portfolio-videos">
                <h4>Video zapisi</h4>
                <div className="video-grid">
                  {portfolioData.videos.map((video, index) => (
                    <div key={index} className="video-item">
                      <video controls>
                        <source
                          src={`http://localhost:8080${video}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

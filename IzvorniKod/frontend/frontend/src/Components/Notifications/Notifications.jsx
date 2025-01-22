import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";

//Stranica za obavijesti o audicijama po preferenciji za plesače
const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //Funkcija za dohvat svih obavijesti
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          "http://localhost:8080/audition/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Nije moguće učitati obavijesti");
        }
        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Učitavanje obavijesti...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleAuditionClick = (id) => {
    navigate(`/audition/${id}`);
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
      <div className="notifications-page">
        <h2>Obavijesti o audicijama:</h2>
        {notifications.length === 0 ? (
          <p>Nema audicija po vašim preferencijama.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-header">
                  <div className="audition-header">
                    <h3>Audicija #{notification.id}</h3>
                    <button
                      className="accept-button"
                      onClick={() => handleAuditionClick(notification.id)}
                    >
                      Detaljnije
                    </button>
                    <span className="subscribed-count">
                      Primljeni: {notification.subscribed || 0}/
                      {notification.positions}
                    </span>
                  </div>
                </div>
                <div className="notification-details">
                  <p>
                    <strong>Autor: </strong>
                    <Link to={`/profile/${notification.author}`}>
                      {notification.author}
                    </Link>
                  </p>
                  <p>
                    <strong>Lokacija:</strong> {notification.location}
                  </p>
                  <p>
                    <strong>Opis:</strong> {notification.description}
                  </p>
                  <p>
                    <strong>Stilovi:</strong> {notification.styles.join(", ")}
                  </p>
                  <p>
                    <strong>Datum i vrijeme:</strong>{" "}
                    {new Date(notification.datetime).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

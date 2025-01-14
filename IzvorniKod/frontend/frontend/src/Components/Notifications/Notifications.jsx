import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";
import "./Notifications.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
                  <p>
                    <strong>Broj pozicija: </strong>
                    {notification.positions}
                  </p>
                </div>
                <div className="notification-details">
                  <p>
                    <strong>Description:</strong> {notification.description}
                  </p>
                  <p>
                    <strong>Plaća (EUR):</strong> {notification.wage}
                  </p>
                  <p>
                    <strong>Stilovi:</strong> {notification.styles.join(", ")}
                  </p>
                  <p>
                    <strong>Napravljena:</strong>{" "}
                    {new Date(notification.creation).toLocaleString()}
                  </p>
                  <p>
                    <strong>Rok prijave:</strong>{" "}
                    {new Date(notification.deadline).toLocaleString()}
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

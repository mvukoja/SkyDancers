import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";
import { jwtDecode } from "jwt-decode";
//import "./Applications.css";

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.sub;
    } catch (error) {
      console.error("Greška pri dekodiranju tokena:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch applications
        const response = await fetch(
          "http://localhost:8080/audition/getmyapplications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Nije moguće učitati prijave");
        }

        const applicationsData = await response.json();
        setApplications(applicationsData);
        setLoading(false);

        // Check the status for each application
        const checkApplication = async (id) => {
          try {
            const response = await fetch(
              `http://localhost:8080/audition/manage/applications/${id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("Nije moguće učitati stanje");
            }

            const applicationStatusData = await response.json();
            const matchingApplication = applicationStatusData.find(
              (app) => app.applicant.username === getUsernameFromToken()
            );

            if (matchingApplication) {
              setApplications((prevApplications) =>
                prevApplications.map((app) =>
                  app.id === id
                    ? {
                        ...app,
                        status: matchingApplication.status,
                      }
                    : app
                )
              );
            }
          } catch (err) {
            console.error(
              `Error checking application for ID ${id}:`,
              err.message
            );
          }
        };

        // Check the application status for each fetched application
        (applicationsData || []).forEach((app) => {
          checkApplication(app.id);
        });
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching applications:", err.message);
      }
    };
    fetchApplications();
  }, []);

  if (loading) {
    return <div>Učitavanje prijava...</div>;
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
        <h2>Vaše poslane prijave:</h2>
        {applications.length === 0 ? (
          <p>Nemate prijave.</p>
        ) : (
          <ul>
            {applications.map((application) => (
              <div key={application.id} className="notification-item">
                <div className="notification-header">
                  <div className="audition-header">
                    <h3>Audicija #{application.id}</h3>
                    <button
                      className="accept-button"
                      onClick={() => handleAuditionClick(application.id)}
                    >
                      Detaljnije
                    </button>
                    <span className="subscribed-count">
                      Prijavljeni: {application.subscribed || 0}/
                      {application.positions}
                    </span>
                  </div>
                </div>
                <div className="notification-details">
                  <p>
                    <strong>Autor: </strong>
                    <Link to={`/profile/${application.author}`}>
                      {application.author}
                    </Link>
                  </p>
                  <p>
                    <strong>Lokacija:</strong> {application.location}
                  </p>
                  <p>
                    <strong>Opis:</strong> {application.description}
                  </p>
                  <p>
                    <strong>Stilovi:</strong> {application.styles.join(", ")}
                  </p>
                  <p>
                    <strong>Datum i vrijeme:</strong>{" "}
                    {new Date(application.datetime).toLocaleString()}
                  </p>
                  {application.status && (
                    <div className="confirmation-message">
                      <span
                        style={{
                          color:
                            application.status === "Odbijena"
                              ? "red"
                              : application.status === "U tijeku"
                              ? "purple"
                              : "green",
                        }}
                      >
                        {application.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Applications;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";
import "./AuditionInfo.css";
import { jwtDecode } from "jwt-decode";

const AuditionInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [audition, setAudition] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicationsLoaded, setApplicationsLoaded] = useState(false);
  const [showNoApplicationsMessage, setShowNoApplicationsMessage] =
    useState(false);
  const [subscribed, setSubscribed] = useState(0);
  const [showApplications, setShowApplications] = useState(false);

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
    const fetchUser = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await fetch("http://localhost:8080/users/myprofile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Greška pri dohvaćanju podataka profila");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error("Greška pri dohvaćanju podataka profila:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchAudition = async () => {
        try {
          const token = localStorage.getItem("jwtToken");
          const response = await fetch(
            `http://localhost:8080/audition/get/${id}`,
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
          setAudition(data);
          setSubscribed(data.subscribed);
        } catch (err) {
          console.error("Audicija ne postoji ili je došlo do greške!");
        }
      };

      fetchAudition();
    }
  }, [id]);

  useEffect(() => {
    if (profileData?.type?.type === "DANCER" && id) {
      const checkApplication = async () => {
        try {
          const token = localStorage.getItem("jwtToken");
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
          const data = await response.json();
          const matchedApplication = data.find(
            (app) => app.applicant.username === getUsernameFromToken()
          );
          if (matchedApplication) {
            setConfirmationMessage(matchedApplication.status);
          }
        } catch (err) {
          console.error(err);
        }
      };

      checkApplication();
    }
  }, [profileData, id]);

  const handleApplication = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const payload = {
        auditionId: id,
      };
      const response = await fetch(
        `http://localhost:8080/audition/applytoaudition`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Nije moguće ažurirati ponudu");
      }
      setConfirmationMessage("Prijava je uspješno poslana!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplicationDirector = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8080/audition/manage/applications/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Nije moguće učitati prijave");
      }
      const data = await response.json();
      setApplications(data);
      setApplicationsLoaded(true);
      setShowNoApplicationsMessage(data.length === 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptResponse = async (audId, state) => {
    if (subscribed >= audition.positions) {
      alert("Audicija je već popunjena");
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8080/audition/manage/allow/${audId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nije moguće ažurirati ponudu");
      }
      const updatedApplications = applications.map((application) =>
        application.id === audId
          ? { ...application, status: state }
          : application
      );
      const updatedSubscribed = subscribed + 1;
      setApplications(updatedApplications);
      setSubscribed(updatedSubscribed);
      if (updatedSubscribed >= audition.positions) {
        window.href.location = `/audition/${audId}`;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDenyResponse = async (audId, state) => {
    if (subscribed >= audition.positions) {
      alert("Audicija je već popunjena");
      return;
    }
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8080/audition/manage/deny/${audId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nije moguće ažurirati ponudu");
      }
      const updatedApplications = applications.map((application) =>
        application.id === audId
          ? { ...application, status: state }
          : application
      );
      setApplications(updatedApplications);
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchivation = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8080/audition/archive/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Nije moguće ažurirati ponudu");
      }
      alert("Uspješno ste arhivirali audiciju.");
      navigate("/my-auditions");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleApplicationsVisibility = () => {
    setShowApplications(!showApplications);
  };

  useEffect(() => {
    if (showApplications) {
      handleApplicationDirector();
    }
  }, [showApplications]);

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
        <h2>Pregled audicije:</h2>
        {!audition ? (
          <p>Audicija ne postoji.</p>
        ) : (
          <div key={audition.id} className="notification-item">
            <div className="audition-header">
              <p>
                <strong>Autor: </strong>
                <Link to={`/profile/${audition.author}`}>
                  {audition.author}
                </Link>
              </p>
              <span className="subscribed-count">
                Primljeni: {subscribed || 0}/{audition.positions}
              </span>
            </div>
            <div className="notification-details">
              {audition.archived === true ? (
                <>
                  <p>
                    <strong style={{ color: "red" }}>Arhivirana</strong>
                  </p>
                </>
              ) : (
                ""
              )}
              <p>
                <strong>Broj pozicija: </strong>
                {audition.positions}
              </p>
              <p>
                <strong>Opis:</strong> {audition.description}
              </p>
              <p>
                <strong>Lokacija:</strong> {audition.location}
              </p>
              <p>
                <strong>Plaća (EUR):</strong> {audition.wage}
              </p>
              <p>
                <strong>Stilovi:</strong> {audition.styles.join(", ")}
              </p>
              <p>
                <strong>Napravljena:</strong>{" "}
                {new Date(audition.creation).toLocaleString()}
              </p>
              <p>
                <strong>Rok prijave:</strong>{" "}
                {new Date(audition.deadline).toLocaleString()}
              </p>
              <p><strong style={{color: "red"}}>
              {subscribed === audition.positions && ("Audicija je popunjena")}
                </strong></p>
              {profileData?.type?.type === "DANCER" &&
                subscribed < audition.positions &&
                !confirmationMessage && (
                  <div className="application">
                    {new Date(audition.deadline) > new Date() ? (
                      <button
                        onClick={() => handleApplication()}
                        className="apply-audition"
                      >
                        Prijavi se na audiciju
                      </button>
                    ) : (
                      <p>
                        <strong>Rok prijave je istekao!</strong>
                      </p>
                    )}
                  </div>
                )}

              {profileData?.type?.type === "DANCER" && confirmationMessage && (
                <div className="confirmation-message">
                  <span
                    style={{
                      color:
                        confirmationMessage === "Odbijena"
                          ? "red"
                          : confirmationMessage === "U tijeku"
                          ? "purple"
                          : "green",
                    }}
                  >
                    {confirmationMessage}
                  </span>
                </div>
              )}
              {profileData?.type?.type === "DIRECTOR" && (
                <>
                  <div className="application">
                    {new Date(audition.deadline) <= new Date() && (
                      <p>
                        <strong>Rok prijave je istekao!</strong>
                      </p>
                    )}
                    <button
                      onClick={toggleApplicationsVisibility}
                      className="apply-audition"
                    >
                      {showApplications
                        ? "Sakrij prijave"
                        : "Pregled prijava na audiciju"}
                    </button>
                    {audition.archived === false && (
                      <>
                        {"  "}
                        <button
                          onClick={() => handleArchivation()}
                          className="apply-audition"
                        >
                          Arhiviranje audicije
                        </button>
                      </>
                    )}
                  </div>
                  {showApplications && (
                    <>
                      {applicationsLoaded &&
                        applications.length === 0 &&
                        showNoApplicationsMessage && <p>Nemate prijave.</p>}

                      {applications.length > 0 && (
                        <>
                          <p>
                            <strong>Ukupno prijava: </strong>
                            {applications.length}
                          </p>
                          <ul>
                            {applications.map((application) => (
                              <div
                                key={application.id}
                                className="notification-item"
                              >
                                <div className="notification-header">
                                  <div className="audition-header">
                                    <h3>Prijava</h3>
                                  </div>
                                </div>
                                <div className="notification-details">
                                  <p>
                                    <strong>Autor: </strong>
                                    <Link
                                      to={`/profile/${application.applicant.username}`}
                                    >
                                      {application.applicant.username}
                                    </Link>
                                  </p>
                                  <p>
                                    <strong>Lokacija:</strong>{" "}
                                    {application.applicant.location}
                                  </p>
                                  <p>
                                    <strong>Dob:</strong>{" "}
                                    {application.applicant.age}
                                  </p>
                                  <p>
                                    <strong>Stilovi:</strong>{" "}
                                    {application.applicant.danceStyles
                                      .map((style) => style.name)
                                      .join(", ")}
                                  </p>
                                  <p>
                                    <strong>Datum i vrijeme:</strong>{" "}
                                    {new Date(
                                      application.datetime
                                    ).toLocaleString()}
                                  </p>
                                  <p>
                                    <strong>Stanje prijave:</strong>{" "}
                                    {application.status}
                                  </p>
                                  {audition.archived === false && subscribed < audition.positions &&
                                    application.status === "U tijeku" && (
                                      <div className="offer-actions">
                                        <button
                                          onClick={() =>
                                            handleAcceptResponse(
                                              application.id,
                                              "Prihvaćena"
                                            )
                                          }
                                          className="accept-button"
                                        >
                                          Prihvati
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDenyResponse(
                                              application.id,
                                              "Odbijena"
                                            )
                                          }
                                          className="reject-button"
                                        >
                                          Odbij
                                        </button>
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))}
                          </ul>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditionInfo;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";
import "./UserProfile.css";
import { jwtDecode } from "jwt-decode";

const danceStylesList = [
  "Balet",
  "Jazz",
  "Hip-Hop",
  "Salsa",
  "Tango",
  "Valcer",
  "Breakdance",
  "Suvremeni",
];

const UserProfile = ({ onLogout }) => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [offerMessage, setOfferMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [myType, setMyType] = useState(null);
  const navigate = useNavigate();
  //stvari za uredivanje od strane admina
  const [isEditing, setIsEditing] = useState(false); // Kontrolira prikaz forme za uređivanje ili prikaz podataka
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]); // Odabrane vrste plesa
  const [description, setDescription] = useState("");
  const [descriptionchange, setDescriptionchange] = useState("");

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
    if (username === getUsernameFromToken()) {
      navigate("/myprofile");
    }
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const profileResponse = await fetch(
          `http://localhost:8080/users/get/${username}`,
          { headers }
        );

        if (!profileResponse.ok) {
          throw new Error("Nije moguće dohvatiti profil korisnika.");
        }

        const profileResult = await profileResponse.json();
        setProfileData(profileResult);
        setFormData(profileResult);
        var matchingDanceStyles;

        if (profileResult.type.type === "DANCER") {
          matchingDanceStyles = profileResult.danceStyles
            .filter((danceStyle) => danceStylesList.includes(danceStyle.name))
            .map((danceStyle) => danceStyle.name);
        } else matchingDanceStyles = null;

        setSelectedDanceStyles(matchingDanceStyles || []);

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
  }, [username, navigate]);

  useEffect(() => {
    const fetchMytype = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const profileResponse = await fetch(
          `http://localhost:8080/users/getmytype`,
          { headers }
        );

        if (!profileResponse.ok) {
          throw new Error("Nije moguće dohvatiti profil korisnika.");
        }

        const mytype = await profileResponse.text();
        setMyType(mytype);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMytype();
  }, [profileData]);

  const handleSendOffer = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const body = {
        dancerid: profileData.id,
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

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(
        `http://localhost:8080/users/delete/${username}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Došlo je do greške pri slanju ponude.");
      }
      const text = await response.text();
      if (text === "Success") {
        alert(`Uspješno ste izbrisali korisnika: ${username}`);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profileData) {
    return <div>Učitavanje...</div>;
  }

  const startChatWithUser = (userId, userName) => {
    const selectedUser = {
      type: { userid: userId },
      name: userName,
    };
    localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    window.location.href = "/chat";
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Promijeni status uređivanja
  };

  const handlePortfolioEditToggle = () => {
    setIsEditingPortfolio(!isEditingPortfolio);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData, // Zadrži postojeće podatke iz forme
      [e.target.name]: e.target.value, // Ažuriraj vrijednost promijenjenog polja
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
    if (!token) {
      navigate("/", { replace: true }); // Ako token ne postoji, preusmjeri na početnu stranicu
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/users/update-profile/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Postavi Content-Type zaglavlje
            Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
          },
          body: JSON.stringify(formData), // Pošalji formData kao JSON
        }
      );

      if (!response.ok) {
        throw new Error("Greška pri ažuriranju profila");
      }

      const updatedData = await response.json(); // Parsiraj odgovor kao JSON
      setProfileData(updatedData); // Ažuriraj podatke profila u stanju
      setIsEditing(false); // Prekini način uređivanja
      alert("Profil uspješno ažuriran!"); // Prikaži poruku uspjeha korisniku
    } catch (error) {
      console.error("Greška pri ažuriranju profila:", error);
    }
  };

  const handleDescription = async () => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
    try {
      const response = await fetch(
        `http://localhost:8080/portfolio/updatedescription/${username}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
          },
          body: descriptionchange,
        }
      );

      if (!response.ok) {
        throw new Error("Greška pri uploadu datoteke");
      }
      const newItem = await response.json(); // Parsiraj odgovor kao JSON
      setDescription(newItem.description); // Dodaj novu stavku u portfolio*/
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error("Greška pri uploadu datoteke:", error);
    }
  };

  // Funkcija za brisanje slike iz portfolia
  const handleDeletePortfolioPhoto = async (name) => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
    try {
      const response = await fetch(
        `http://localhost:8080/portfolio/deletephoto/${username}?photoname=${name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
          },
        }
      );

      if (!response.ok) {
        throw new Error("Greška pri brisanju stavke iz portfolia");
      }
      const newItem = await response.json(); // Parsiraj odgovor kao JSON
      setPortfolioData(newItem); // Dodaj novu stavku u portfolio*/
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error("Greška pri brisanju stavke iz portfolia:", error);
    }
  };
  // Funkcija za brisanje videa iz portfolia
  const handleDeletePortfolioVideo = async (name) => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
    try {
      const response = await fetch(
        `http://localhost:8080/portfolio/deletevideo/${username}?photoname=${name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
          },
        }
      );

      if (!response.ok) {
        throw new Error("Greška pri brisanju stavke iz portfolia");
      }
      const newItem = await response.json(); // Parsiraj odgovor kao JSON
      setPortfolioData(newItem); // Dodaj novu stavku u portfolio*/
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error("Greška pri brisanju stavke iz portfolia:", error);
    }
  };

  const saveDanceStyles = async () => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage

    try {
      const response = await fetch(
        `http://localhost:8080/users/update-dance-styles/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Postavi Content-Type zaglavlje
            Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
          },
          body: JSON.stringify({ danceStyles: selectedDanceStyles }), // Pošalji odabrane vrste plesa kao JSON
        }
      );

      if (!response.ok) {
        throw new Error("Greška pri ažuriranju vrsta plesa");
      }

      alert("Vrste plesa uspješno ažurirane"); // Prikaži poruku uspjeha korisniku
      window.location.reload();
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error("Greška pri ažuriranju vrsta plesa:", error);
    }
  };

  const handleSubmit = () => {
    handleDescription();
    setIsEditingPortfolio();
    alert("Uspješno izmijenjen portfolio");
  };

  const handleDescriptionChange = (e) => {
    setDescriptionchange(e.target.value);
  };

  const handleDanceStyleChange = (e) => {
    const value = e.target.value; // Dohvati vrijednost checkboxa
    setSelectedDanceStyles(
      (prevStyles) =>
        prevStyles.includes(value)
          ? prevStyles.filter((style) => style !== value) // Ako je već odabrano, ukloni ga iz liste
          : [...prevStyles, value] // Inače, dodaj ga u listu
    );
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

      <div className="profile-container">
        <div className="profile-header">
          <h2>
            {profileData.name} {profileData.surname}
          </h2>
          <span className="user-type">
            {profileData.type.type === "DANCER" ? "PLESAČ" : "DIREKTOR"}
          </span>
        </div>
        <div className="profile-sections">
          {isEditing ? (
            <div className="profile-edit-form">
              {/* Polje za unos imena */}
              <label>
                Ime:
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              </label>
              {/* Polje za unos prezimena */}
              <label>
                Prezime:
                <input
                  type="text"
                  name="surname"
                  value={formData.surname || ""}
                  onChange={handleChange}
                />
              </label>
              {/* Polje za unos lokacije */}
              <label>
                Lokacija:
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                />
              </label>
              {/* Polje za unos dobi */}
              <label>
                Dob:
                <input
                  type="number"
                  name="age"
                  value={formData.age || ""}
                  onChange={handleChange}
                />
              </label>
              {/* Dropdown za odabir spola */}
              <label>
                Spol:
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Odaberite</option>
                  <option value="M">Muško</option>
                  <option value="F">Žensko</option>
                  <option value="O">Ostalo</option>
                </select>
              </label>
              {/* Dugme za spremanje promjena */}
              <button className="buttons" onClick={handleSave}>
                Spremi
              </button>
              {/* Dugme za odustajanje od uređivanja */}
              <button className="buttons" onClick={handleEditToggle}>
                Odustani
              </button>
            </div>
          ) : (
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
                <strong>Aktivnost:</strong>{" "}
                {profileData.inactive === false
                  ? "Aktivan"
                  : "Neaktivan do " +
                    new Date(profileData.inactiveUntil).toLocaleString()}
              </p>
              <p>
                <strong>Tip korisnika:</strong>{" "}
                {profileData.type.type === "DANCER"
                  ? "Plesač"
                  : profileData.type.type === "DIRECTOR"
                  ? "Direktor"
                  : "Admin"}
              </p>
            </div>
          )}

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
          {myType === "ADMIN" && !isEditing && (
            <div className="send-offer-section">
              <button onClick={handleEditToggle}>Uredi podatke</button>
            </div>
          )}
          {myType === "ADMIN" && profileData.type.type === "DANCER" && (
            <div className="dance-styles-section">
              <h3>Vrste plesa</h3>
              <div className="dance-styles-list">
                {/* Iteracija kroz listu vrsta plesa i prikaz checkboxa za svaku */}
                {danceStylesList.map((style) => (
                  <label key={style}>
                    <input
                      type="checkbox"
                      value={style}
                      checked={selectedDanceStyles.includes(style)}
                      onChange={handleDanceStyleChange}
                    />
                    {style}
                  </label>
                ))}
              </div>
              {/* Dugme za spremanje odabranih vrsta plesa */}
              <button onClick={saveDanceStyles}>Spremi Nove Vrste Plesa</button>
            </div>
          )}
        </div>
        <div className="chatbutton">
          {profileData.inactive === false ? (
            <>
              <button
                onClick={() =>
                  startChatWithUser(
                    profileData.id,
                    profileData.username
                  )
                }
              >
                Započni chat
              </button>
              <br />
            </>
          ) : (
            <>
              <span>Osoba je stavila status neaktivan!</span>
              <br />
              <br />
            </>
          )}
        </div>
        {profileData.type.type === "DANCER" &&
          profileData.inactive === false &&
          myType !== "ADMIN" && (
            <div className="send-offer-section">
              <button onClick={() => setShowModal(true)}>Pošalji ponudu</button>
            </div>
          )}

        <br />
        {myType === "ADMIN" && (
          <div className="send-offer-section">
            <button
              onClick={handleDeleteUser}
              style={{ backgroundColor: "red" }}
            >
              Izbriši profil
            </button>
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
            {myType === "ADMIN" && (
              <>
                <button className="buttons" onClick={handlePortfolioEditToggle}>
                  Uredi portfolio
                </button>
                <hr />
              </>
            )}
            {isEditingPortfolio ? (
              <>
                <input
                  name="description"
                  type="text"
                  placeholder={description}
                  value={descriptionchange}
                  onChange={handleDescriptionChange}
                />
                <button onClick={handleSubmit}>Spremi Portfolio</button>
              </>
            ) : (
              <></>
            )}
            <div className="portfolio-description">
              <h4>O meni</h4>
              <p>
                {portfolioData.description
                  ? portfolioData.description
                  : "Nije unesen portfolio"}
              </p>
            </div>

            {portfolioData.photos && portfolioData.photos.length > 0 && (
              <div className="portfolio-items">
                <div className="photo-grid">
                  {portfolioData.photos.map((photo, index) => (
                    <div key={index} className="portfolio-item">
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
                      {myType === "ADMIN" && (
                        <button
                          onClick={() =>
                            handleDeletePortfolioPhoto(
                              photo.split("uploads/")[1]
                            )
                          }
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {portfolioData.videos && portfolioData.videos.length > 0 && (
                  <>
                    <div className="video-grid">
                      {portfolioData.videos.map((video, index) => (
                        <div key={index} className="video-item">
                          <video controls>
                            <source
                              src={`http://localhost:8080${video}`}
                              type="video/mp4"
                            />
                            {myType === "ADMIN" && (
                              <button
                                onClick={() =>
                                  handleDeletePortfolioVideo(
                                    video.split("uploads/")[1]
                                  )
                                }
                              >
                                X
                              </button>
                            )}
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

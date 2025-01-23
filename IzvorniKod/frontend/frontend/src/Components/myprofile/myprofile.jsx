import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./myprofile.css";
import { Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";
import { jwtDecode } from "jwt-decode";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Definicija dostupnih vrsta plesa
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

const MyProfile = ({ onLogout }) => {
  // Inicijalizacija stanja komponente
  const [profileData, setProfileData] = useState(null); // Pohranjuje podatke korisničkog profila
  const [isEditing, setIsEditing] = useState(false); // Kontrolira prikaz forme za uređivanje ili prikaz podataka
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [formData, setFormData] = useState({}); // Pohranjuje podatke unutar forme za uređivanje
  const [portfolioItems, setPortfolioItems] = useState([]); // Lista stavki u portfoliju korisnika
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]); // Odabrane vrste plesa
  const [inactive, setIsInactive] = useState(false); // Status neaktivnosti korisničkog profila
  const [inactiveUntil, setInactiveUntil] = useState(""); // Datum do kojeg je profil neaktivan
  const [description, setDescription] = useState("");
  const [descriptionchange, setDescriptionchange] = useState("");
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  const navigate = useNavigate(); // Hook za navigaciju između ruta

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${backendUrl}/users/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: 10000,
          quantity: 1,
          name: "Godišnja pretplata za direktora",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === "SUCCESS") {
        window.location.href = data.sessionUrl;
      } else {
        alert("Došlo je do pogreške prilikom kreiranja sesije plaćanja.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Greška prilikom obrade plaćanja. Pokušajte ponovno.");
    }
  };

  // Funkcija za izdvajanje korisničkog imena iz JWT tokena
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

  // useEffect hook za dohvaćanje podataka profila prilikom montiranja komponente
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
      if (!token) {
        navigate("/", { replace: true }); // Ako token ne postoji, preusmjeri na početnu stranicu
        return;
      }

      let username = getUsernameFromToken(); // Pokušaj izdvojiti korisničko ime iz tokena

      try {
        const response = await fetch(`${backendUrl}/users/myprofile`, {
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

        const portfolio = await fetch(
          `${backendUrl}/portfolio/get/${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
            },
          }
        );
        if (!portfolio.ok) {
          throw new Error("Greška pri dohvaćanju podataka profila");
        }
        const portfoliodata = await portfolio.json();

        setProfileData(data); // Postavi podatke profila u stanje
        setFormData(data); // Inicijaliziraj formData s dohvaćenim podacima
        setPortfolioItems(portfoliodata || []); // Postavi portfolio stavke
        setDescription(portfoliodata.description);
        var matchingDanceStyles;
        if (data.type.type === "DANCER") {
          matchingDanceStyles = data.danceStyles
            .filter((danceStyle) => danceStylesList.includes(danceStyle.name))
            .map((danceStyle) => danceStyle.name);
        } else matchingDanceStyles = null;

        setSelectedDanceStyles(matchingDanceStyles || []); // Postavi odabrane vrste plesa
        setIsInactive(data.inactive || false); // Postavi status neaktivnosti
        setInactiveUntil(data.inactiveUntil || ""); // Postavi datum neaktivnosti
      } catch (error) {
        alert("Vaša prijava je istekla, molimo prijavite se ponovo.");
        onLogout();
        console.error("Greška pri dohvaćanju podataka profila:", error);
      }
    };

    fetchProfile(); // Pozovi funkciju za dohvaćanje profila
  }, [navigate, onLogout]); // Ovisnosti useEffect-a (navigate i onLogout)

  // Funkcija za prebacivanje između prikaza detalja i forme za uređivanje profila
  const handleEditToggle = () => {
    setIsEditing(!isEditing); // Promijeni status uređivanja
  };

  const handlePortfolioEditToggle = () => {
    setIsEditingPortfolio(!isEditingPortfolio);
  };

  // Funkcija za rukovanje promjenama unutar forme za uređivanje profila
  const handleChange = (e) => {
    setFormData({
      ...formData, // Zadrži postojeće podatke iz forme
      [e.target.name]: e.target.value, // Ažuriraj vrijednost promijenjenog polja
    });
  };

  // Funkcija za spremanje ažuriranih podataka profila na backend
  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
    if (!token) {
      navigate("/", { replace: true }); // Ako token ne postoji, preusmjeri na početnu stranicu
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/users/update-profile/${getUsernameFromToken()}`,
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
      alert("Your token has expired, please login again.");
      onLogout();
      console.error("Greška pri ažuriranju profila:", error);
    }
  };

  // Funkcija za upload datoteke u portfolio
  const handleFileUpload = async () => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
    const formData = new FormData();
    photos.forEach((file) => formData.append("photos", file));
    if (videos.length > 0) {
      videos.forEach((file) => formData.append("videos", file));
    }
    try {
      const response = await fetch(
        `${backendUrl}/portfolio/uploadfile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
          },
          body: formData, // Pošalji FormData kao tijelo zahtjeva
        }
      );

      if (!response.ok) {
        throw new Error("Greška pri uploadu datoteke");
      }

      const newItem = await response.json(); // Parsiraj odgovor kao JSON
      setPortfolioItems(newItem); // Dodaj novu stavku u portfolio*/
      setPhotos([]);
      setVideos([]);
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error("Greška pri uploadu datoteke:", error);
    }
  };

  const handleDescription = async () => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage
    try {
      const response = await fetch(
        `${backendUrl}/portfolio/updatedescription/${getUsernameFromToken()}`,
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
        `${backendUrl}/portfolio/deletephoto/${getUsernameFromToken()}?photoname=${name}`,
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
      setPortfolioItems(newItem); // Dodaj novu stavku u portfolio*/
      window.location.reload();
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
        `${backendUrl}/portfolio/deletevideo/${getUsernameFromToken()}?videoname=${name}`,
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
      setPortfolioItems(newItem); // Dodaj novu stavku u portfolio*/
      window.location.reload();
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error("Greška pri brisanju stavke iz portfolia:", error);
    }
  };

  // Funkcija za rukovanje odabirom vrste plesa
  const handleDanceStyleChange = (e) => {
    const value = e.target.value; // Dohvati vrijednost checkboxa
    setSelectedDanceStyles(
      (prevStyles) =>
        prevStyles.includes(value)
          ? prevStyles.filter((style) => style !== value) // Ako je već odabrano, ukloni ga iz liste
          : [...prevStyles, value] // Inače, dodaj ga u listu
    );
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    Array.from(files).forEach((el) => {
      if (el.size >= 3 * 1024 * 1024) {
        alert("Izabrali ste preveliku datoteku (LIMIT 3MB)");
        event.target.value = null;
        return;
      }
    });

    if (event.target.name === "photos") {
      setPhotos([...files]);
    } else if (event.target.name === "videos") {
      setVideos([...files]);
    }
  };

  const handleSubmit = () => {
    handleDescription();
    handleFileUpload();
    setIsEditingPortfolio();
    alert("Uspješno izmijenjen portfolio");
  };

  // Funkcija za spremanje odabranih vrsta plesa na backend
  const saveDanceStyles = async () => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage

    try {
      const response = await fetch(
        `${backendUrl}/users/update-dance-styles/${getUsernameFromToken()}`,
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
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error("Greška pri ažuriranju vrsta plesa:", error);
    }
  };

  // Funkcija za promjenu statusa neaktivnosti profila
  const handleInactiveChange = () => {
    setIsInactive(!inactive); // Prebaci status neaktivnosti
  };

  // Funkcija za spremanje statusa neaktivnosti na backend
  const saveInactiveStatus = async () => {
    const token = localStorage.getItem("jwtToken"); // Dohvati token iz localStorage

    try {
      const response = await fetch(
        `${backendUrl}/users/update-inactive-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Postavi Content-Type zaglavlje
            Authorization: `Bearer ${token}`, // Dodaj token u zaglavlje zahtjeva
          },
          body: JSON.stringify({ inactive, inactiveUntil }), // Pošalji status i datum neaktivnosti kao JSON
        }
      );

      if (!response.ok) {
        throw new Error("Greška pri ažuriranju statusa profila");
      }

      alert("Status profila uspješno ažuriran"); // Prikaži poruku uspjeha korisniku
    } catch (error) {
      alert("Your token has expired, please login again.");
      onLogout();
      console.error("Greška pri ažuriranju statusa profila:", error);
    }
  };

  // Ako podaci profila nisu dohvaćeni, prikazi poruku o učitavanju
  if (!profileData) {
    return <div>Učitavam profil...</div>;
  }

  const handleDescriptionChange = (e) => {
    setDescriptionchange(e.target.value);
  };

  const handlePasswordToggle = () => {
    navigate("/change-password");
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
          <h2>Moj profil</h2>
          <span className="user-type">
            {profileData.type.type === "DANCER" ? "PLESAČ" : "DIREKTOR"}
          </span>
        </div>

        {profileData?.type.type === "DIRECTOR" && (
          <div className="payment-section">
            {profileData?.paid === false ? (
              <>
                <button className="payment-button" onClick={handlePayment}>
                  Plati članarinu
                </button>
                <p>
                  Da biste koristili ovu aplikaciju potrebno je platiti godišnju
                  članarinu.
                </p>
              </>
            ) : (
              <p className="subscription-info">
                Vaša direktorska članarina traje do:{" "}
                {new Date(profileData.subscription).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Prikaz detalja profila ili forme za uređivanje */}
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
            {/* Prikaz podataka korisničkog profila */}
            <p>
              <strong>Korisničko ime:</strong> {profileData.username}
            </p>
            <p>
              <strong>Ime:</strong> {profileData.name}
            </p>
            {profileData.type.type !== "ADMIN" && (
              <>
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
              </>
            )}
            <p>
              <strong>Tip korisnika:</strong>{" "}
              {profileData.type.type === "DANCER"
                ? "Plesač"
                : profileData.type.type === "DIRECTOR"
                ? "Direktor"
                : "Admin"}
            </p>
            {/* Dugme za prelazak u način uređivanja */}
            {profileData.type.type !== "ADMIN" && (
              <>
                <button onClick={handleEditToggle}>Uredi Profil</button>
                {"    "}
                {profileData.oauth === null && (
                  <button onClick={handlePasswordToggle}>
                    Promjena lozinke
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Sekcija za odabir vrsta plesa */}
        {profileData?.type.type === "DANCER" && (
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
            <button onClick={saveDanceStyles}>Spremi Vrste Plesa</button>
          </div>
        )}

        {/* Sekcija za postavljanje statusa neaktivnosti */}
        {profileData?.type.type === "DANCER" && (
          <div className="inactive-section">
            <h3>Status profila</h3>
            <label>
              <input
                type="checkbox"
                checked={inactive}
                onChange={handleInactiveChange}
              />
              Neaktivan
            </label>
            {/* Ako je profil označen kao neaktivan, prikazi opciju za odabir datuma */}
            {inactive && (
              <div>
                <label>
                  Neaktivan do:
                  <input
                    type="date"
                    value={inactiveUntil}
                    onChange={(e) => {
                      const currentDate = new Date()
                        .toISOString()
                        .split("T")[0];
                      if (e.target.value <= currentDate) {
                        alert("Datum mora biti u budućnosti");
                        e.target.value = "";
                        return;
                      }
                      setInactiveUntil(e.target.value);
                    }}
                  />
                </label>
              </div>
            )}
            {/* Dugme za spremanje statusa neaktivnosti */}
            <button onClick={saveInactiveStatus}>Spremi Status</button>
          </div>
        )}

        {/* Sekcija za upravljanje portfoliom */}
        {profileData.type.type !== "ADMIN" && (
          <>
            <div className="portfolio-section">
              <h3>Moj Portfolio</h3>
              <button className="buttons" onClick={handlePortfolioEditToggle}>
                Uredi portfolio
              </button>
              <hr />
              {/* Input za upload slike ili videozapisa */}
              {isEditingPortfolio ? (
                <>
                  <input
                    name="description"
                    type="text"
                    placeholder={description}
                    value={descriptionchange}
                    onChange={handleDescriptionChange}
                  />
                  <p>Fotografije:</p>
                  <input
                    type="file"
                    accept="image/*"
                    name="photos"
                    onChange={handleFileSelect}
                  />
                  <p>Videozapisi:</p>
                  <input
                    type="file"
                    name="videos"
                    accept="video/*"
                    onChange={handleFileSelect}
                  />
                  <button onClick={handleSubmit}>Spremi Portfolio</button>
                </>
              ) : (
                <></>
              )}
              <p className="portfolio-description">
                {description ? description : "Nemate uneseno ništa u portfolio"}
              </p>
              <br />
              <br />
              <hr />
              <br />
              <div className="portfolio-items">
                {/* Iteracija kroz listu portfolio stavki i prikaz svake */}
                {/* Prikaz slike ili videozapisa ovisno o tipu stavke */}
                <div className="photo-grid">
                  {portfolioItems.photos.length > 0 ? (
                    portfolioItems.photos.map((photo, index) => (
                      <div key={index} className="portfolio-item">
                        <a
                          href={`${backendUrl}${photo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${backendUrl}${photo}`}
                            alt={`Portfolio Photo ${index + 1}`}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "300px",
                              objectFit: "cover",
                            }}
                          />
                        </a>
                        <button
                          onClick={() =>
                            handleDeletePortfolioPhoto(
                              photo.split("uploads/")[1]
                            )
                          }
                        >
                          X
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Nemate spremljene slike.</p>
                  )}
                </div>
                <div className="video-grid">
                  {portfolioItems.videos.length > 0 ? (
                    portfolioItems.videos.map((video, index) => (
                      <div key={index} className="portfolio-item video-item">
                        <video src={`${backendUrl}${video}`} controls>
                          Your browser does not support the video tag.
                        </video>
                        <button
                          onClick={() =>
                            handleDeletePortfolioVideo(
                              video.split("uploads/")[1]
                            )
                          }
                        >
                          X
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Nemate spremljene videozapise.</p>
                  )}
                </div>
                {/* Dugme za brisanje portfolio stavke */}
              </div>
            </div>
          </>
        )}

        {/* Dugme za odjavu korisnika */}
        <button className="logout-button" onClick={onLogout}>
          Odjava
        </button>
      </div>
    </div>
  );
};

export default MyProfile;

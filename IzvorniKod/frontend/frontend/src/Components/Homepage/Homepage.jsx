import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import { Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";
import { jwtDecode } from "jwt-decode";

const Homepage = ({ onLogout }) => {
  const [profileData, setProfileData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
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
        alert("Vaša prijava je istekla, molimo prijavite se ponovo.");
        onLogout();
        console.error("Greška pri dohvaćanju podataka profila:", error);
      }
    };

    fetchProfile(); // Pozovi funkciju za dohvaćanje profila
  }, [navigate, onLogout]); // Ovisnosti useEffect-a (navigate i onLogout)

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
          throw new Error("Unable to load notifications");
        }
        const data = await response.json();
        setNotificationCount(data.length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    const fetchOffers = async (type) => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`http://localhost:8080/offer/${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Unable to load notifications");
        }
        const data = await response.json();
        setOfferCount(data.length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    if (profileData?.type.type === "DANCER") {
      fetchNotifications();
      fetchOffers("dancer");
    } else if (profileData?.type.type === "DIRECTOR") {
      fetchOffers("director");
    }
  }, [profileData]); // Depend on profileData

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      if (searchInput.length < 3) {
        alert("Korisničko ime mora imati barem 3 slova");
        return;
      }
      navigate(`/search-results/${searchInput.trim()}`);
    }
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Function to handle opening the popup
  const openPopup = () => {
    setIsPopupVisible(true);
  };

  // Function to handle closing the popup
  const closePopup = () => {
    setIsPopupVisible(false);
    setInputValue(""); // Clear input when closing
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to handle form submission
  const handleSubscriptionPrice = async () => {
    if (inputValue) {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          `http://localhost:8080/users/changesubscriptionprice?price=${inputValue}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const text = await response.text();
        if (text === "Success") {
          alert("Iznos uspješno promijenjen!");
        }
      } catch (error) {
        console.error("Error submitting number:", error);
      }
      closePopup();
    } else {
      alert("Unesite valjan broj.");
    }
  };

  return (
    <div className="homepage-container">
      <div>
        {isPopupVisible && (
          <div className="price-popup">
            <div className="price-popup2">
              <h3>Unesite iznos (EUR)</h3>
              <h3>
                Napomena: (1000 = 10.00€) <br />
                tj. cijenu navesti u centima{" "}
              </h3>
              <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
              />
              <div>
                <button onClick={handleSubscriptionPrice}>Spremi</button>
                <button onClick={closePopup}>Nazad</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="background-image-container"></div>
      <header className="homepage-header">
        <a href="/" className="logo">
          <img src={headerlogo} alt="" className="logo-img" />
        </a>
        <div className="header-links">
          {((profileData?.type.type === "DIRECTOR" &&
            profileData?.paid === true) ||
            profileData?.type.type !== "DIRECTOR") && (
            <>
              <input
                type="text"
                placeholder="Pretraga korisnika..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="search-bar"
                id="usersearch"
              />
            </>
          )}
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
            Morate izvršiti plaćanje članarine da biste mogli koristiti
            aplikaciju. Posjetite <Link to="/myprofile">svoj profil</Link> kako
            biste izvršili uplatu.
          </p>
        </div>
      )}

      <div className="content-container">
        {!isPopupVisible && (
          <>
            <h1 id="welcome">Dance Hub</h1>
            <h1 id="welcome2">Dobrodošli {profileData?.name}.</h1>
          </>
        )}

        {!isPopupVisible && (
          <div className="welcome-message">
            <h1 className="welcome-heading">
              <strong>Dobrodošli na SkyDancers!</strong>
            </h1>
            <p>
              Vaša platforma za povezivanje plesača i direktora u plesnoj
              industriji.
            </p>
          </div>
        )}
        {profileData?.type.type === "DIRECTOR" ? (
          <div className="button-group">
            {profileData?.paid === true && (
              <>
                <button
                  className="navigation-button"
                  onClick={() => navigate("/post-audition")}
                >
                  Kreiraj audiciju
                </button>
                <button
                  className="navigation-button"
                  onClick={() => navigate("/chat")}
                >
                  Chat s drugim korisnicima
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
                  Pregled poslanih ponuda ({offerCount})
                </button>
              </>
            )}
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
              Chat s drugim korisnicima
            </button>
            <button
              className="navigation-button"
              onClick={() => navigate("/dancer-offers")}
            >
              Pregled primljenih ponuda ({offerCount})
            </button>
            <button
              className="navigation-button"
              onClick={() => navigate("/notifications")}
            >
              <img
                src="../../notification-bell.svg"
                alt=""
                style={{ width: "25px", height: "25px" }}
              />{" "}
              Audicije po vašim preferencijama ({notificationCount})
            </button>
            <button
              className="navigation-button"
              onClick={() => navigate("/applications")}
            >
              Pregled mojih prijava na audicije
            </button>
          </div>
        ) : (
          profileData?.type.type === "ADMIN" &&
          !isPopupVisible && (
            <>
              <div className="button-group">
                <button className="navigation-button" onClick={openPopup}>
                  Namještanje godišnje pretplate za direktore
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Homepage;

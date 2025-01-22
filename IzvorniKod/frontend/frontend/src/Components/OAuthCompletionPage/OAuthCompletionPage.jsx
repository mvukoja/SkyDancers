import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import email_icon from "../Assets/email.png";
import user_icon from "../Assets/person.png";
import InputField from "../LoginSignup/InputField";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

//Stranica za dovršetak OAuth registracije
const OAuthCompletionPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [type, setType] = useState("DANCER");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  var oauth = null;
  var finished = false;
  oauth = searchParams.get("oauth");
  finished = searchParams.get("finished");

  useEffect(() => {
    //Funkcija za dohvat JWT tokena
    const getJwt = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/users/authenticateoauth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: oauth,
          }
        );
        if (!response.ok)
          throw new Error("Failed to complete OAuth registration");
        const token = await response.text();
        if (token) {
          localStorage.setItem("jwtToken", token); // Sprema JWT token u lokalnu pohranu
          onLogin(); // Poziva funkciju koja postavlja status prijavljenog korisnika
        }
      } catch (error) {
        console.error("Error completing OAuth registration:", error);
      }
    };
    if (!oauth) {
      navigate("/", { replace: true });
    }
    if (finished === "true") {
      getJwt();
    }
  }, [oauth, navigate, finished, onLogin]);

  //Funkcija za slanje dodatnih podataka pri registraciji
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const data = {
      username,
      email,
      type,
      oauth: oauth,
    };

    try {
      const response = await fetch(
        `${backendUrl}/users/complete-oauth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok)
        throw new Error("Failed to complete OAuth registration");
      const text = await response.text();
      if (text === "Already taken") {
        alert("Korisničko ime je već zauzeto.");
        return;
      }
      if (text) {
        localStorage.setItem("jwtToken", text); // Sprema JWT token u lokalnu pohranu
        onLogin(); // Poziva funkciju koja postavlja status prijavljenog korisnika
      } else return;
    } catch (error) {
      console.error("Error completing OAuth registration:", error);
    }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex za provjeru ispravnosti emaila
    if (!emailRegex.test(email)) {
      alert("Unesite validnu email adresu.");
      return false;
    }
    if (username.length < 3) {
      alert("Korisničko ime mora imati barem 3 slova");
      return false;
    }
    if (!email) {
      alert("Niste unijeli email.");
      return false;
    }
    return true;
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{"Registracija"}</div>
        <div className="underline"></div>
      </div>
      <h2>Dovršite GitHub registraciju</h2>
      <p>
        <strong>Molimo vas da unesete dodatne informacije.</strong>
      </p>
      <div className="inputs">
        <InputField
          icon={user_icon}
          type="text"
          placeholder="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          icon={email_icon}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="DANCER">Plesač</option>
          <option value="DIRECTOR">Direktor</option>
        </select>
      </div>
      <div className="submit-container">
        <button className="submit" onClick={handleSubmit}>
          Dovrši
        </button>
      </div>
    </div>
  );
};

export default OAuthCompletionPage;

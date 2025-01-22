import React, { useState } from "react";
import "./myprofile.css";
import InputField from "../LoginSignup/InputField";
import { Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";

//Stranica za promjenu lozinke
const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");

  //Funkcija za slanje nove lozinke na backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      setMessage("Lozinke se ne podudaraju.");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:8080/users/changepassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password,
            repeatPassword,
          }),
        }
      );
      const result = await response.text();
      if (result === "Lozinka je promijenjena!") {
        alert("Lozinka je uspješno promijenjena!");
        window.location.href = "/myprofile";
      } else if (result === "Lozinke nisu iste!") {
        alert("Lozinke nisu iste!");
      } else {
        setMessage("Došlo je do greške. Molimo pokušajte ponovno.");
      }
    } catch (error) {
      setMessage("Došlo je do greške. Molimo pokušajte ponovno.");
    }
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
      <div className="container">
        <div className="header">
          <div className="text">Promjena lozinke</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <form onSubmit={handleSubmit} className="inputs">
            <InputField
              type="password"
              placeholder="Nova lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
              type="password"
              placeholder="Ponovite lozinku"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            <div className="submit-container">
              <button type="submit" className="submit">
                Promijeni Lozinku
              </button>
            </div>
            {message && <div className="message">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

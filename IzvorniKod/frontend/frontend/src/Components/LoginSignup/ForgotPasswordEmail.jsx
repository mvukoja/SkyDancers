import React, { useState } from "react";
import "./LoginSignup.css";
import InputField from "./InputField";
import email_icon from "../Assets/email.png";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

//Stranica za unos maila kod zaboravljene lozinke
const ForgotPasswordEmail = ({ onEmailSent }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  //Funkcija za verifikaciju maila
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${backendUrl}/forgotpassword/verifymail/${email}`,
        {
          method: "POST",
        }
      );
      const result = await response.text();
      if (result === "Github login") {
        alert("Prijavite se preko GitHuba!");
        return;
      }
      if (result === "Email poslan") {
        alert("Email s kodom je poslan na vašu adresu.");
        onEmailSent(email);
      } else {
        setMessage("Korisnik s tim emailom ne postoji.");
      }
    } catch (error) {
      setMessage("Došlo je do greške. Molimo pokušajte ponovno.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Zaboravljena Lozinka</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <form onSubmit={handleSubmit}>
          <InputField
            type="email"
            icon={email_icon}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="submit-container">
            <button type="submit" className="submit">
              Pošalji kod
            </button>
            <button
              className="submit"
              onClick={() => (window.location.href = "/login")}
            >
              Nazad na prijavu/registraciju
            </button>
          </div>

          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;

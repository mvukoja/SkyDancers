import React, { useState } from "react";
import "./LoginSignup.css";
import InputField from "./InputField";

//Stranica za unos OTP koda kod zaboravljene lozinke
const ForgotPasswordOTP = ({ email, onOTPVerified }) => {
  const [otp, setOTP] = useState("");
  const [message, setMessage] = useState("");

  //Funkcija za provjeru OTP koda
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://skydancers-back.onrender.com/forgotpassword/verifyotp/${otp}/${email}`,
        {
          method: "POST",
        }
      );
      const result = await response.text();
      if (result === "Success!") {
        onOTPVerified();
      } else {
        setMessage("Neispravan kod. Molimo pokušajte ponovno.");
      }
    } catch (error) {
      setMessage("Došlo je do greške. Molimo pokušajte ponovno.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Unesite Kod</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="Unesite kod iz emaila"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          <div className="submit-container">
            <button type="submit" className="submit">
              Potvrdi
            </button>
          </div>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;

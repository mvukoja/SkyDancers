import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import headerlogo from "../Assets/header-logo.png";

//Landing stranica za neulogirane korisnike
function LandingPage() {
  return (
    <div className="landing-container">
      <div className="background-image-container2"></div>
      <header>
        <a href="/" className="logo">
          <img src={headerlogo} alt="" className="logo-img" />
        </a>
        <div className="header-links">
          <Link to="/login" className="login">
            <button>Prijava</button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default LandingPage;

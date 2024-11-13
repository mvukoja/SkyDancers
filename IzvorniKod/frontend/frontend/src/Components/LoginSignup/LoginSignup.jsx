import React, { useState } from 'react';
import './LoginSignup.css';
import { GoogleLogin } from '@react-oauth/google';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import InputField from './InputField';
import { useNavigate } from 'react-router-dom';

// Komponenta za Login i Signup funkcionalnosti
const LoginSignup = ({ onLogin }) => {
  // Stanja za praćenje unosa korisnika i statusa registracije ili prijave
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("DANCER");

  const navigate = useNavigate();

  // Funkcija za validaciju unesenih podataka u formi
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex za provjeru ispravnosti emaila
    if (isRegistering && !emailRegex.test(email)) { // Provjerava da li je email ispravan tijekom registracije
      alert("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) { // Provjerava da li je lozinka dovoljno dugačka
      alert("Password must be at least 8 characters long.");
      return false;
    }

    // Provjera da li su sva obavezna polja popunjena
    if (isRegistering && (!username || !name || !surname || !email || !password)) {
      alert("Please fill out all fields.");
      return false;
    } else if (!isRegistering && (!username || !password)) {
      alert("Please enter both username and password.");
      return false;
    }

    return true; // Vraća true ako su svi podaci ispravni
  }

  // Funkcija za registraciju novog korisnika
  const handleRegister = async () => {
    if (!validateForm()) return; // Ako validacija ne prođe, prekid funkcije

    const data = {
      username,
      name,
      surname,
      email,
      password,
      type,
      oauth: "false",
      finishedoauth: "true"
    };

    try {
      // Slanje zahtjeva na backend za registraciju
      const response = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Registration failed"); // Provjera da li je zahtjev uspio
      const text = await response.text();

      // Ako registracija uspije, korisnik dobiva poruku i preusmjerava se na login
      if(text === "Registration successful!"){
        alert("Registration successful, now login!");
        window.location.href = '/';
      } else {
        alert("Username already exists!");
      }
      
    } catch (error) {
      console.error("Error during registration:", error); // Prikaz greške u konzoli ako registracija ne uspije
    }
  };

  // Funkcija za prijavu korisnika
  const handleLogin = async () => {
    if (!validateForm()) return; // Validacija podataka prije prijave

    const data = { username, password };

    try {
      const response = await fetch('http://localhost:8080/users/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Login failed"); // Ako prijava ne uspije, baci grešku

      const token = await response.text();
      if (token) {
        localStorage.setItem('jwtToken', token); // Sprema JWT token u lokalnu pohranu
        onLogin(); // Poziva funkciju koja postavlja status prijavljenog korisnika
      }
    } catch (error) {
      console.error("Error during login:", error); // Prikaz greške u konzoli
    }
  };

  // Funkcija za prebacivanje između registracije i prijave
  const toggleRegistration = () => setIsRegistering(!isRegistering);

  // Funkcija za prijavu putem GitHub OAuth-a
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github"; // Preusmjeravanje na GitHub OAuth
  };

  // Funkcija koja se poziva kada je prijava putem Google-a uspješna
  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    localStorage.setItem('jwtToken', credentialResponse.credential); // Sprema JWT token
    onLogin(); // Ažurira status prijavljenog korisnika
    navigate('/oauth-completion'); // Preusmjerava korisnika na stranicu za dodatne podatke
  };

  return (
    <div className="container">
      {/* Zaglavlje stranice */}
      <div className="header">
        <div className="text">{isRegistering ? "Register" : "Login"}</div>
        <div className="underline"></div>
      </div>
      
      {/* Polja za unos */}
      <div className="inputs">
        {/* Prikaz polja specifičnih za registraciju */}
        {isRegistering && (
          <>
            <InputField
              icon={user_icon}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputField
              icon={user_icon}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              icon={user_icon}
              type="text"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <InputField
              icon={email_icon}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}
        {/* Polja za unos korisničkog imena i lozinke */}
        {!isRegistering && (
          <InputField
            icon={user_icon}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <InputField
          icon={password_icon}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Padajući izbornik za odabir tipa korisnika tijekom registracije */}
        {isRegistering && (
          <select
            className="select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="DANCER">Dancer</option>
            <option value="DIRECTOR">Director</option>
          </select>
        )}
      </div>

      {/* Gumbi za slanje zahtjeva */}
      <div className="submit-container">
        {/* Gumb za registraciju ili prijavu */}
        {isRegistering ? (
          <button className="submit" onClick={handleRegister}>Register</button>
        ) : (
          <button className="submit" onClick={handleLogin}>Login</button>
        )}
        {/* Gumb za prebacivanje između registracije i prijave */}
        <button className="submit" onClick={toggleRegistration}>
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
        {/* Gumbi za OAuth prijavu putem GitHub-a i Google-a */}
        <div className="oauth-buttons">
          <button className="submit" onClick={handleGitHubLogin}>Login with GitHub</button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

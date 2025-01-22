import React, { useEffect, useState } from "react";
import "./LoginSignup.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import InputField from "./InputField";
import ForgotPassword from "./ForgotPassword";

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Funkcija za validaciju unesenih podataka u formi
  const validateForm = () => {
    // Provjera da li su sva obavezna polja popunjena
    if (
      isRegistering &&
      (!username || !name || !surname || !email || !password)
    ) {
      alert("Popunite sva polja.");
      return false;
    } else if (!isRegistering && (!username || !password)) {
      alert("Popunite sva polja.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex za provjeru ispravnosti emaila
    if (isRegistering && !emailRegex.test(email)) {
      // Provjerava da li je email ispravan tijekom registracije
      alert("Unesite validnu email adresu.");
      return false;
    }

    if (username.length < 3) {
      alert("Korisničko ime mora imati barem 3 slova");
      return false;
    }

    if (name.length > 0 && surname.length > 0) {
      if (!(/^[A-Z]/.test(name) && /^[A-Z]/.test(surname))) {
        alert("Ime i prezime moraju imati veliko slovo.");
        return false;
      }
    }

    if (password.length < 8) {
      // Provjerava da li je lozinka dovoljno dugačka
      alert("Lozinka mora biti duga barem 8 znakova.");
      return false;
    }

    return true; // Vraća true ako su svi podaci ispravni
  };

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
      finishedoauth: "true",
    };
    if (data.type === "DIRECTOR") {
      try {
        // Slanje zahtjeva na backend za registraciju
        const response = await fetch(
          "https://skydancers-back.onrender.com/users/registerdirector",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) throw new Error("Registration failed"); // Provjera da li je zahtjev uspio
        const text = await response.text();

        // Ako registracija uspije, korisnik dobiva poruku o provjeri emaila
        if (text === "Registration successful!") {
          alert(
            "Registracija uspješna! Molimo provjerite svoj email za verifikaciju računa."
          );
          window.location.href = "/login";
        } else {
          alert("Korisničko ime već postoji!");
        }
      } catch (error) {
        console.error("Error during registration:", error); // Prikaz greške u konzoli ako registracija ne uspije
        alert(
          "Došlo je do greške prilikom registracije. Molimo pokušajte ponovno."
        );
      }
    } else {
      try {
        // Slanje zahtjeva na backend za registraciju
        const response = await fetch(
          "https://skydancers-back.onrender.com/users/registerdancer",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) throw new Error("Registration failed"); // Provjera da li je zahtjev uspio
        const text = await response.text();

        // Ako registracija uspije, korisnik dobiva poruku o provjeri emaila
        if (text === "Registration successful!") {
          alert(
            "Registracija uspješna! Molimo provjerite svoj email za verifikaciju računa."
          );
          window.location.href = "/login";
        } else {
          alert("Korisničko ime već postoji!");
        }
      } catch (error) {
        console.error("Error during registration:", error); // Prikaz greške u konzoli ako registracija ne uspije
        alert(
          "Došlo je do greške prilikom registracije. Molimo pokušajte ponovno."
        );
      }
    }
  };

  // Funkcija za prijavu korisnika
  const handleLogin = async () => {
    if (!validateForm()) return; // Validacija podataka prije prijave

    const data = { username, password };

    try {
      const response = await fetch("https://skydancers-back.onrender.com/users/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Login failed"); // Ako prijava ne uspije, baci grešku

      const token = await response.text();
      if (token === "Github login") {
        alert("Prijavite se preko GitHuba!");
        return;
      }
      if (token === "Invalid credentials") {
        alert("Pogrešni podaci!");
        return;
      }
      if (token === "Nedovršena registracija! Provjerite svoj mail!") {
        alert(
          "Nedovršena registracija! Provjerite svoj mail za potvrdu registracije!"
        );
        return;
      }
      if (token) {
        localStorage.setItem("jwtToken", token); // Sprema JWT token u lokalnu pohranu
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
    window.location.href = "https://skydancers-back.onrender.com/oauth2/authorization/github"; // Preusmjeravanje na GitHub OAuth
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        if (isRegistering) {
          handleRegister();
        } else {
          handleLogin();
        }
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [isRegistering, username, name, surname, email, password]);

  if (showForgotPassword) {
    return <>{showForgotPassword && <ForgotPassword />}</>;
  }
  return (
    <div className="container">
      {/* Zaglavlje stranice */}
      <div className="header">
        <div className="text">{isRegistering ? "Registracija" : "Prijava"}</div>
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
              placeholder="Korisničko ime"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputField
              icon={user_icon}
              type="text"
              placeholder="Ime"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              icon={user_icon}
              type="text"
              placeholder="Prezime"
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
            placeholder="Korisničko ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        <InputField
          icon={password_icon}
          type="password"
          placeholder="Lozinka"
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
            <option value="DANCER">Plesač</option>
            <option value="DIRECTOR">Direktor</option>
          </select>
        )}
      </div>

      {/* Gumbi za slanje zahtjeva */}
      <div className="submit-container">
        {/* Gumb za registraciju ili prijavu */}
        {isRegistering ? (
          <button className="submit" onClick={handleRegister}>
            Registracija
          </button>
        ) : (
          <>
            <button className="submit" onClick={handleLogin}>
              Prijava
            </button>
          </>
        )}
        {/* Gumb za prebacivanje između registracije i prijave */}
        <button className="submit" onClick={toggleRegistration}>
          {isRegistering
            ? "Već imate račun? Prijava"
            : "Nemate račun? Registracija"}
        </button>
        {/* Gumbi za OAuth prijavu putem GitHub-a */}
        <div className="oauth-buttons">
          <button className="submit" onClick={handleGitHubLogin}>
            <img
              src="../../github-mark.svg"
              alt=""
              style={{ width: "25px", height: "25px" }}
            />
            &nbsp; Prijava s GitHub-om
          </button>
        </div>
      </div>
      {!isRegistering && (
        <>
          <button
            className="forgot-password submit"
            onClick={() => setShowForgotPassword(true)}
          >
            Zaboravili ste lozinku?
          </button>
          {showForgotPassword && <ForgotPassword />}
        </>
      )}
    </div>
  );
};

export default LoginSignup;

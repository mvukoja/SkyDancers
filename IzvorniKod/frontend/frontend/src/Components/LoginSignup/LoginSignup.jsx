import React, { useState } from 'react';
import './LoginSignup.css';
import { GoogleLogin } from '@react-oauth/google';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import InputField from './InputField';
import { useNavigate } from 'react-router-dom';

const LoginSignup = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("DANCER");

  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isRegistering && !emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.")
      return false;
    }

    if (isRegistering && (!username || !name || !surname || !email || !password)) {
      alert("Please fill out all fields.");
      return false;
    } else if (!isRegistering && (!username || !password)) {
      alert("Please enter both username and password.");
      return false;
    }

    return true;
  }

  const handleRegister = async () => {
    if (!validateForm()) return;

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
      const response = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Registration failed");
      const text = await response.text();
      if(text === "Registration successful!"){
        alert("Registration successful, now login!");
        window.location.href = '/';
      }
      else{
        alert("Username already exists!");
      }
      
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const data = { username, password };

    try {
      const response = await fetch('http://localhost:8080/users/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Login failed");

      const token = await response.text();
      if (token) {
        localStorage.setItem('jwtToken', token);
        onLogin();
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const toggleRegistration = () => setIsRegistering(!isRegistering);

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    localStorage.setItem('jwtToken', credentialResponse.credential);
    onLogin(); // Update authentication state
    navigate('/oauth-completion'); // Redirect to the OAuth completion page
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{isRegistering ? "Register" : "Login"}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
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
      <div className="submit-container">
        {isRegistering ? (
          <button className="submit" onClick={handleRegister}>Register</button>
        ) : (
          <button className="submit" onClick={handleLogin}>Login</button>
        )}
        <button className="submit" onClick={toggleRegistration}>
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
        <div className="oauth-buttons">
          <button className="submit" onClick={handleGitHubLogin}>Login with GitHub</button>
          <div className="custom-google-login">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => console.log("Google Login Failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

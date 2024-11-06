import React, { useState } from 'react';
import './LoginSignup.css';
import { GoogleLogin } from '@react-oauth/google';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import InputField from './InputField';

const LoginSignup = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("DANCER");

  // Function to handle registration
  const handleRegister = async () => {
    const data = {
      username,
      name,
      surname,
      email,
      password,
      type,
      oauth: "false",
    };

    try {
      const response = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Registration failed");
      const result = await response.json();
      console.log("Registration successful:", result);

      // Store JWT token if received and navigate to homepage
      if (result.token) {
        localStorage.setItem('jwtToken', result.token);
        onLogin();
      } else {
        console.error("No token received after registration.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  // Function to handle login
  const handleLogin = async () => {
    const data = { username, password };

    try {
      const response = await fetch('http://localhost:8080/users/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Login failed");
      const result = await response.json();
      localStorage.setItem('jwtToken', result.token);
      console.log("Login successful:", result);

      onLogin();
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Toggle between registration and login forms
  const toggleRegistration = () => setIsRegistering(!isRegistering);

  // Redirect to GitHub login
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    onLogin();
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
          </>
        )}
        <InputField
          icon={email_icon}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => console.log("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

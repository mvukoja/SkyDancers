import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import InputField from './InputField';

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = { email, password };

    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Login failed");
      const result = await response.json();
      console.log("Login successful:", result);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google Login Success:", credentialResponse);
    // Here, you can send the credentialResponse to the backend for further processing
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <InputField icon={email_icon} type="email" placeholder="Email ID" onChange={(e) => setEmail(e.target.value)} />
        <InputField icon={password_icon} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="submit-container">
        <button className="submit" onClick={handleLogin}>Login</button>
      </div>
      <div className="oauth-buttons">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => console.log("Google Login Failed")}
        />
      </div>
    </div>
  );
};

export default LoginSignup;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCompletionPage = () => {
  const [email, setEmail] = useState('');
  const [type, setType] = useState('DANCER');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error("No JWT token found, redirecting to login.");
      navigate('/');
      return;
    }

    const data = {
      email,
      type,
      oauth: "true",
    };

    try {
      const response = await fetch('http://localhost:8080/users/complete-oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Failed to complete OAuth registration");

      navigate('/home');
    } catch (error) {
      console.error("Error completing OAuth registration:", error);
    }
  };

  return (
    <div className="oauth-completion-container">
      <h2>Complete Your Registration</h2>
      <p>Please enter additional information to complete your registration.</p>
      
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Account Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="DANCER">Dancer</option>
          <option value="DIRECTOR">Director</option>
        </select>
      </label>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default OAuthCompletionPage;

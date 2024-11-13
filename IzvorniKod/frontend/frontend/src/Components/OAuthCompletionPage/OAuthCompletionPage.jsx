import React, { useState, useEffect} from 'react';
import './OAuthCompletionPage.css';
import { useNavigate } from 'react-router-dom';

const OAuthCompletionPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("DANCER");
  const navigate = useNavigate();
  
  var jwt = null;
  var finished = false;
  const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === "jwtToken") {
              jwt = decodeURIComponent(cookieValue);
            }
            else if(cookieName === "finishedoauth"){
              finished = decodeURIComponent(cookieValue);
            }
    }
    useEffect(() => {
      if (!jwt) {
          navigate('/', { replace: true });
      }
  }, [jwt, navigate]);


  if(finished==="true"){
      document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "finishedoauth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.setItem('jwtToken', jwt);
      onLogin();
  }


  const handleSubmit = async () => {
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
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to complete OAuth registration");
      document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.setItem('jwtToken', jwt);
      onLogin();
    } catch (error) {
      console.error("Error completing OAuth registration:", error);
    }
  };

  return (
    <div className="oauth-completion-container">
      <h2>Complete Your Registration</h2>
      <p>Please enter additional information to complete your registration.</p>
      
      <label>
        Email:&nbsp;
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Account Type:&nbsp;
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

import React, { useState, useEffect} from 'react';
import './OAuthCompletionPage.css';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const OAuthCompletionPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("DANCER");
  const navigate = useNavigate();
  /////

  const [searchParams, setSearchParams] = useSearchParams();

  var jwt = null;
  var finished = false;
  jwt = searchParams.get('jwt');
  finished = searchParams.get('finished');
  
  useEffect(() => {
    if (!jwt) {
        navigate('/', { replace: true });
    }
  }, [jwt, navigate]);

  console.log(jwt, finished);

  if(finished==="true"){
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

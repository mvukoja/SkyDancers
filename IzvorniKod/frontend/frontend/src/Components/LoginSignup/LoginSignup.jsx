import React, { useState } from 'react';
import './LoginSignup.css';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import InputField from './InputField';

export const LoginSignup = () => {
  const [action, setAction] = useState("Login");

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Sign Up" && <InputField icon={user_icon} type="text" placeholder="Name" />}
        <InputField icon={email_icon} type="email" placeholder="Email ID" />
        <InputField icon={password_icon} type="password" placeholder="Password" />
      </div>
      {action === "Login" && (
        <div className="forgot-password">
          Lost Password? <span>Click here!</span>
        </div>
      )}
      <div className="submit-container">
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
      </div>
    </div>
  );
};

export default LoginSignup;

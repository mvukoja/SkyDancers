import React, { useState } from 'react';
import './LoginSignup.css';
import InputField from './InputField';

const ForgotPasswordEmail = ({ onEmailSent }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/forgotpassword/verifymail/${email}`, {
                method: 'POST',
            });
            const result = await response.text();
            if (result === "Email poslan") {
                alert('Email s kodom je poslan na vašu adresu.');
                onEmailSent(email);
            } else {
                setMessage('Korisnik s tim emailom ne postoji.');
            }
        } catch (error) {
            setMessage('Došlo je do greške. Molimo pokušajte ponovno.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">Zaboravljena Lozinka</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <form onSubmit={handleSubmit}>
                    <InputField
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="submit-container">
                        <button type="submit" className="submit">Pošalji kod</button>
                        <button className="submit" onClick={() => window.location.href = "/login"}>
                             Nazad na prijavu/registraciju
                        </button>
                    </div>
                    
                    {message && <div className="message">{message}</div>}
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;

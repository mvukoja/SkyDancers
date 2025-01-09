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
                setMessage('Email s kodom je poslan na vašu adresu.');
                onEmailSent(email); // Pass email to parent component
            } else {
                setMessage('Došlo je do greške. Molimo pokušajte ponovno.');
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
            <form onSubmit={handleSubmit}>
                <InputField
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="submit-container">
                    <button type="submit" className="submit">Pošalji kod</button>
                </div>
                {message && <div className="message">{message}</div>}
            </form>
        </div>
    );
};

export default ForgotPasswordEmail;

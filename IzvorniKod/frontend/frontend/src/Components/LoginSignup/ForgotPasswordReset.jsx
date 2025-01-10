import React, { useState } from 'react';
import './LoginSignup.css';
import InputField from './InputField';

const ForgotPasswordReset = ({ email }) => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setMessage('Lozinke se ne podudaraju.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/forgotpassword/changepassword/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password,
                    repeatPassword
                })
            });
            const result = await response.text();
            if (result === "Lozinka je promijenjena!") {
                alert('Lozinka je uspješno promijenjena! Možete se prijaviti s novom lozinkom.');
                window.location.href = '/login'; // Redirect to login page
            }
            else if (result === "Lozinke nisu iste!") {
                alert('Lozinke nisu iste!');
            }
             else {
                setMessage('Došlo je do greške. Molimo pokušajte ponovno.');
            }
        } catch (error) {
            setMessage('Došlo je do greške. Molimo pokušajte ponovno.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">Nova Lozinka</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <form onSubmit={handleSubmit}>
                    <InputField
                        type="password"
                        placeholder="Nova lozinka"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputField
                        type="password"
                        placeholder="Ponovite lozinku"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    <div className="submit-container">
                        <button type="submit" className="submit">Promijeni Lozinku</button>
                    </div>
                    {message && <div className="message">{message}</div>}
                </form>
            </div>
            
        </div>
    );
};

export default ForgotPasswordReset;

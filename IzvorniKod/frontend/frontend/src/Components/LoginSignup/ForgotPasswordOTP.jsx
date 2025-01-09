import React, { useState } from 'react';
import './LoginSignup.css';
import InputField from './InputField';

const ForgotPasswordOTP = ({ email, onOTPVerified }) => {
    const [otp, setOTP] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/forgotpassword/verifyotp/${otp}/${email}`, {
                method: 'POST',
            });
            const result = await response.text();
            if (result === "Success!") {
                onOTPVerified(); // Move to password reset page
            } else {
                setMessage('Neispravan kod. Molimo pokušajte ponovno.');
            }
        } catch (error) {
            setMessage('Došlo je do greške. Molimo pokušajte ponovno.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">Unesite Kod</div>
                <div className="underline"></div>
            </div>
            <form onSubmit={handleSubmit}>
                <InputField
                    type="text"
                    placeholder="Unesite kod iz emaila"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                />
                <div className="submit-container">
                    <button type="submit" className="submit">Potvrdi</button>
                </div>
                {message && <div className="message">{message}</div>}
            </form>
        </div>
    );
};

export default ForgotPasswordOTP;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-success">
      <h2>Plaćanje uspješno!</h2>
      <p>Hvala što ste platili članarinu. Vaša pretplata je aktivirana.</p>
      <button onClick={() => navigate('/myprofile')} className="return-button">
        Povratak na profil
      </button>
    </div>
  );
};

export default PaymentSuccess;

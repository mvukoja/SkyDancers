import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-cancel">
      <h2>Plaćanje nije uspjelo</h2>
      <p>Nažalost, nismo mogli dovršiti vaše plaćanje. Pokušajte ponovno ili kontaktirajte podršku.</p>
      <button onClick={() => navigate('/myprofile')} className="return-button">
        Povratak na profil
      </button>
    </div>
  );
};

export default PaymentCancel;

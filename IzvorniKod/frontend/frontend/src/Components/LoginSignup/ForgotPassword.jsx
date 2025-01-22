import React, { useState } from "react";
import ForgotPasswordEmail from "./ForgotPasswordEmail";
import ForgotPasswordOTP from "./ForgotPasswordOTP";
import ForgotPasswordReset from "./ForgotPasswordReset";

//Komponente od funkcije zaboravljena lozinka
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const handleEmailSent = (userEmail) => {
    setEmail(userEmail);
    setStep(2);
  };

  const handleOTPVerified = () => {
    setStep(3);
  };

  return (
    <div>
      {step === 1 && <ForgotPasswordEmail onEmailSent={handleEmailSent} />}
      {step === 2 && (
        <ForgotPasswordOTP email={email} onOTPVerified={handleOTPVerified} />
      )}
      {step === 3 && <ForgotPasswordReset email={email} />}
    </div>
  );
};

export default ForgotPassword;

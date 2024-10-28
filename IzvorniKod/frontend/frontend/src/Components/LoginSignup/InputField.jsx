import React from 'react';

const InputField = ({ icon, type, placeholder }) => (
  <div className="input">
    <img src={icon} alt="" />
    <input type={type} placeholder={placeholder} />
  </div>
);

export default InputField;

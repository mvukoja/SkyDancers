import React from 'react';

const InputField = ({ icon, type, placeholder, value, onChange }) => (
  <div className="input">
    <img src={icon} alt="" />
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
    />
  </div>
);

export default InputField;
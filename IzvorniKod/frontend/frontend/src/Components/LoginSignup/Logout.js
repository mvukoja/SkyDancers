import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Komponenta za logout
const Logout = ({ onLogout }) => {
  const navigate = useNavigate();
  useEffect(() => {
    onLogout();
    navigate("/");
  }, [onLogout, navigate]);

  return null;
};

export default Logout;

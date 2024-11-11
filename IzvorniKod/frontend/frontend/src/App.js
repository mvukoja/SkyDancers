import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Homepage from './Components/Homepage/Homepage.jsx';
import OAuthCompletionPage from './Components/OAuthCompletionPage/OAuthCompletionPage';
import Logout from './Components/LoginSignup/Logout';
import LandingPage from './Components/LandingPage/LandingPage';
import MyProfile from './Components/myprofile/myprofile'; // Import MyProfile 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginSignup onLogin={handleLogin} />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Homepage onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/oauth-completion"
          element={<OAuthCompletionPage onLogin={handleLogin}/>}
        />
        <Route
          path="/myprofile"
          element={isAuthenticated ? <MyProfile onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;

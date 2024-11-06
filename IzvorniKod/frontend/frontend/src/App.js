import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Homepage from './Components/Homepage/Homepage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Remove JWT token
    setIsAuthenticated(false); // Update authentication state
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/home" /> : <LoginSignup onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/home" 
          element={
            isAuthenticated ? <Homepage onLogout={handleLogout} /> : <Navigate to="/" />
          } 
        />
        <Route 
          path="/logout" 
          element={<Navigate to="/" replace />} // Redirects to login on logout
        />
      </Routes>
    </Router>
  );
}

export default App;

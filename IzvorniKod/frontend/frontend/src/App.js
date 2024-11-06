import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Homepage from './Components/Homepage/Homepage';
import Logout from './Components/LoginSignup/logout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <LoginSignup onLogin={handleLogin} />}
        />
        <Route
          path="/home"
          element={isAuthenticated ? <Homepage onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        {/* Logout routes to clear authentication and redirect to login */}
        <Route
          path="/logout"
          element={<Logout onLogout={handleLogout} />}
        />
        <Route
          path="/home/logout"
          element={<Logout onLogout={handleLogout} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

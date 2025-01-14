// src/App.jsx

// Uvoz potrebnih modula i komponenti iz 'react-router-dom' za upravljanje rutama
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// Uvoz React hookova za upravljanje stanjem i efektima
import { useState, useEffect } from 'react';
// Uvoz komponenti za različite stranice aplikacije
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Homepage from './Components/Homepage/Homepage.jsx';
import OAuthCompletionPage from './Components/OAuthCompletionPage/OAuthCompletionPage';
import Logout from './Components/LoginSignup/Logout';
import LandingPage from './Components/LandingPage/LandingPage';
import MyProfile from './Components/myprofile/myprofile'; // Import MyProfile komponente
import PaymentSuccess from './Components/Payment/PaymentSuccess.jsx';
import PaymentCancel from './Components/Payment/PaymentCancel.jsx';
import CreateAudition from './Components/Auditions/CreateAudition';
import SearchDancers from './Components/SearchDancers/SearchDancers.jsx';
import UserProfile from './Components/UserProfile/UserProfile';
import DirectorAuditions from './Components/DirectorAuditions/DirectorAuditions'; // Import DirectorAuditions komponente
import SearchAuditions from './Components/SearchAuditions/SearchAuditions';
import DancerOffers from './Components/Offers/DancerOffers.jsx';
import DirectorOffers from './Components/Offers/DirectorOffers.jsx';

// Definicija glavne App komponente
function App() {
  // Stanje koje prati je li korisnik autentificiran
  // Inicijalno stanje se postavlja na true ako postoji 'jwtToken' u localStorage, inače na false
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));

  // Funkcija koja se poziva prilikom uspješne prijave korisnika
  const handleLogin = () => {
    setIsAuthenticated(true); // Ažurira stanje na autentificirano
  };

  // Funkcija koja se poziva prilikom odjave korisnika
  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Uklanja JWT token iz localStorage
    setIsAuthenticated(false); // Ažurira stanje na neautentificirano
  };

  // useEffect hook koji se izvršava samo jednom prilikom montiranja komponente
  // Provjerava postoji li 'jwtToken' u localStorage i postavlja stanje 'isAuthenticated' odgovarajuće
  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); // Dohvati JWT token iz localStorage
    setIsAuthenticated(!!token); // Postavi stanje na true ako token postoji, inače na false
  }, []); // Prazna ovisnost znači da se efekt izvršava samo jednom

  // Renderiranje komponenti unutar Router-a za upravljanje navigacijom
  return (
    <Router>
      <Routes>
        {/* Definicija rute za početnu stranicu */}
        <Route path='/' element={
            isAuthenticated 
              ? <Homepage onLogout={handleLogout} /> // Ako je korisnik autentificiran, prikaži Homepage komponentu
              : <LandingPage /> // Inače, preusmjeri na početnu stranicu
          }/>
        
        {/* Definicija rute za stranicu za prijavu */}
        <Route
          path="/login"
          element={
            isAuthenticated 
              ? <Navigate to="/" replace /> // Ako je korisnik već autentificiran, preusmjeri na /home
              : <LoginSignup onLogin={handleLogin} /> // Inače, prikaži komponentu za prijavu/registraciju
          }
        />
        
        {/* Definicija rute za početnu stranicu nakon prijave */}
        <Route
          path="/home"
          element={
            isAuthenticated 
              ? <Homepage onLogout={handleLogout} /> // Ako je korisnik autentificiran, prikaži Homepage komponentu
              : <Navigate to="/" replace /> // Inače, preusmjeri na početnu stranicu
          }
        />
        
        {/* Definicija rute za završnu stranicu OAuth procesa */}
        <Route
          path="/oauth-completion"
          element={
            isAuthenticated 
            ? <Navigate to="/" replace />
            : <OAuthCompletionPage onLogin={handleLogin}/> // Prikaži OAuthCompletionPage komponentu i proslijedi handleLogin funkciju
          } 
        />
        
        {/* Definicija rute za korisnički profil */}
        <Route
          path="/myprofile"
          element={
            isAuthenticated 
              ? <MyProfile onLogout={handleLogout} /> // Ako je korisnik autentificiran, prikaži MyProfile komponentu
              : <Navigate to="/" replace /> // Inače, preusmjeri na početnu stranicu
          }
        />
        
        {/* Definicija rute za odjavu korisnika */}
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} /> {/* Prikaži Logout komponentu */}

        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/post-audition" element={<CreateAudition />} />
        <Route path='/search-dancers' element={<SearchDancers />} />
        <Route path='/search-auditions' element={
          isAuthenticated 
            ? <SearchAuditions />
            : <Navigate to="/" replace />
        } />
        <Route path='/my-auditions' element={
          isAuthenticated 
            ? <DirectorAuditions />
            : <Navigate to="/" replace />
        } />
        <Route
          path="/profile/:username"
          element={
            isAuthenticated 
              ? <UserProfile />
              : <Navigate to="/" replace />
          }
        />

      <Route path='/dancer-offers' element={<DancerOffers />} />
      <Route path='/director-offers' element={<DirectorOffers />} />
        
      </Routes>
    </Router>
  );
}

// Eksportiranje App komponente kao zadanu export
export default App;

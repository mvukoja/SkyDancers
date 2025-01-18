// src/App.jsx

// Uvoz potrebnih modula i komponenti iz 'react-router-dom' za upravljanje rutama
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
// Uvoz React hookova za upravljanje stanjem i efektima
import { useState, useEffect } from "react";
// Uvoz komponenti za različite stranice aplikacije
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Homepage from "./Components/Homepage/Homepage.jsx";
import OAuthCompletionPage from "./Components/OAuthCompletionPage/OAuthCompletionPage";
import Logout from "./Components/LoginSignup/Logout";
import LandingPage from "./Components/LandingPage/LandingPage";
import MyProfile from "./Components/myprofile/myprofile"; // Import MyProfile komponente
import PaymentSuccess from "./Components/Payment/PaymentSuccess.jsx";
import PaymentCancel from "./Components/Payment/PaymentCancel.jsx";
import CreateAudition from "./Components/Auditions/CreateAudition";
import SearchDancers from "./Components/SearchDancers/SearchDancers.jsx";
import UserProfile from "./Components/UserProfile/UserProfile";
import SearchResults from "./Components/SearchResults/SearchResults.jsx";
import DirectorAuditions from "./Components/DirectorAuditions/DirectorAuditions"; // Import DirectorAuditions komponente
import SearchAuditions from "./Components/SearchAuditions/SearchAuditions";
import DancerOffers from "./Components/Offers/DancerOffers.jsx";
import DirectorOffers from "./Components/Offers/DirectorOffers.jsx";
import NotificationsPage from "./Components/Notifications/Notifications.jsx";
import Chat from "./Components/Chat/Chat";
import { AuthProvider } from "./Components/AuthContext";
import AuditionInfo from "./Components/AuditionInfo/AuditionInfo.jsx";
import Applications from "./Components/Applications/Applications.jsx";
import ChangePassword from "./Components/myprofile/ChangePassword.jsx";
import "./global.css";
// Definicija glavne App komponente
function App() {
  // Stanje koje prati je li korisnik autentificiran
  // Inicijalno stanje se postavlja na true ako postoji 'jwtToken' u localStorage, inače na false
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("jwtToken")
  );

  // Funkcija koja se poziva prilikom uspješne prijave korisnika
  const handleLogin = () => {
    setIsAuthenticated(true); // Ažurira stanje na autentificirano
  };

  // Funkcija koja se poziva prilikom odjave korisnika
  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Uklanja JWT token iz localStorage
    setIsAuthenticated(false); // Ažurira stanje na neautentificirano
  };

  // useEffect hook koji se izvršava samo jednom prilikom montiranja komponente
  // Provjerava postoji li 'jwtToken' u localStorage i postavlja stanje 'isAuthenticated' odgovarajuće
  useEffect(() => {
    const token = localStorage.getItem("jwtToken"); // Dohvati JWT token iz localStorage
    setIsAuthenticated(!!token); // Postavi stanje na true ako token postoji, inače na false
  }, []); // Prazna ovisnost znači da se efekt izvršava samo jednom

  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserType = async () => {
        try {
          const token = localStorage.getItem("jwtToken");
          const response = await fetch(
            "http://localhost:8080/users/getmytype",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.text();
          setUserType(data);
        } catch (error) {
          console.error("Failed to fetch user type:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserType();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const PrivateRoute = ({ children, allowedTypes }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return allowedTypes.includes(userType) ? children : <Navigate to="/" />;
  };

  // Renderiranje komponenti unutar Router-a za upravljanje navigacijom
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Definicija rute za početnu stranicu */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Homepage onLogout={handleLogout} /> // Ako je korisnik autentificiran, prikaži Homepage komponentu
              ) : (
                <LandingPage />
              ) // Inače, preusmjeri na početnu stranicu
            }
          />
          {/* Definicija rute za stranicu za prijavu */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace /> // Ako je korisnik već autentificiran, preusmjeri na /home
              ) : (
                <LoginSignup onLogin={handleLogin} />
              ) // Inače, prikaži komponentu za prijavu/registraciju
            }
          />
          {/* Definicija rute za početnu stranicu nakon prijave */}
          <Route
            path="/home"
            element={
              isAuthenticated ? (
                <Homepage onLogout={handleLogout} /> // Ako je korisnik autentificiran, prikaži Homepage komponentu
              ) : (
                <Navigate to="/" replace />
              ) // Inače, preusmjeri na početnu stranicu
            }
          />
          {/* Definicija rute za završnu stranicu OAuth procesa */}
          <Route
            path="/oauth-completion"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <OAuthCompletionPage onLogin={handleLogin} />
              ) // Prikaži OAuthCompletionPage komponentu i proslijedi handleLogin funkciju
            }
          />
          {/* Definicija rute za korisnički profil */}
          <Route
            path="/myprofile"
            element={
              isAuthenticated ? (
                <PrivateRoute allowedTypes={["DIRECTOR", "DANCER", "ADMIN"]}>
                  <MyProfile onLogout={handleLogout} />
                </PrivateRoute>
              ) : (
                <Navigate to="/" replace />
              ) // Inače, preusmjeri na početnu stranicu
            }
          />
          {/* Definicija rute za odjavu korisnika */}
          <Route
            path="/logout"
            element={<Logout onLogout={handleLogout} />}
          />{" "}
          {/* Prikaži Logout komponentu */}
          <>
            <Route
              path="/payment/success"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DIRECTOR"]}>
                    <PaymentSuccess />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/payment/cancel"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DIRECTOR"]}>
                    <PaymentCancel />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/post-audition"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DIRECTOR"]}>
                    <CreateAudition />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/search-dancers"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DIRECTOR"]}>
                    <SearchDancers />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/search-results/:username"
              element={
                isAuthenticated ? (
                  <SearchResults />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/search-auditions"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DANCER"]}>
                    <SearchAuditions />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/my-auditions"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DIRECTOR"]}>
                    <DirectorAuditions />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/profile/:username"
              element={
                isAuthenticated ? (
                  <UserProfile onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/audition/:id"
              element={
                isAuthenticated ? <AuditionInfo /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/dancer-offers"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DANCER"]}>
                    <DancerOffers />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/director-offers"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DIRECTOR"]}>
                    <DirectorOffers />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/notifications"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DANCER"]}>
                    <NotificationsPage />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/chat"
              element={isAuthenticated ? <Chat /> : <Navigate to="/" replace />}
            />
            <Route
              path="/applications"
              element={
                isAuthenticated ? (
                  <PrivateRoute allowedTypes={["DANCER"]}>
                    <Applications />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/change-password"
              element={
                isAuthenticated ? (
                  <ChangePassword />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Eksportiranje App komponente kao zadanu export
export default App;

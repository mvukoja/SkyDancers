import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="529626358951-dbed6jqo4p1dsdvije3af0m500upq5l6.apps.googleusercontent.com">
      <div className="App">
        <LoginSignup />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;

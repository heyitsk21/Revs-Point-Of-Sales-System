import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import LoginScreen from './LoginScreen';
import { UserProvider } from './UserContext';
import reportWebVitals from './reportWebVitals';
import AppRoutes from './AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { TextSizeProvider } from './components/TextSizeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Check if the user is logged in
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="733292463164-aaka96c72dunj93ihdcdjvojahrigloh.apps.googleusercontent.com">
      <Router>
        <UserProvider>
          <TextSizeProvider>
            {/* Render LoginScreen if user is not logged in */}
            <AppRoutes />
          </TextSizeProvider>
        </UserProvider>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

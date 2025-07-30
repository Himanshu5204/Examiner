import { StrictMode } from 'react';
import './index.css';
import App from './App.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ This is the correct import
import { useAuth, AuthProvider } from './pages/Context/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

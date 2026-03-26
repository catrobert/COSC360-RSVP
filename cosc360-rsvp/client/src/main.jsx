import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './css/index.css'
import App from './app/App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';

/* Components don't go here! Put them in App.jsx */

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>   
    </StrictMode>
  </BrowserRouter>
)

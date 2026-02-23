import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Reviews from './components/ReviewCard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Reviews />
  </StrictMode>,
)

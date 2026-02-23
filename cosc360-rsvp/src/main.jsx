import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EventContainer from './components/EventCard.jsx'
import './components/EventCard.css';
import ReviewCard from './components/ReviewCard.jsx'
import './components/Review.css';
import RegisterForm from './components/RegisterForm.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegisterForm />
    <ReviewCard />
    <EventContainer />
  </StrictMode>,
)
import './App.css'
import EventContainer from './components/event_cards/EventContainer.jsx'
import ReviewCard from './components/ReviewCard.jsx'
import RegisterForm from './components/RegisterForm.jsx'

function App() {
  return (
    <>
      <RegisterForm />
      <ReviewCard />
      <EventContainer />
    </>
  )
}

export default App

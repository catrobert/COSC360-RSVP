import './App.css'
import RegisterForm from './components/RegisterForm.jsx'
import ReviewCard from './components/review_bar/ReviewContainer.jsx'
import EventContainer from './components/event_cards/EventContainer.jsx'

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

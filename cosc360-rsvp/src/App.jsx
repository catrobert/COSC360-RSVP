import { Routes, Route } from "react-router-dom";
import './css/App.css'
import RegisterForm from './components/RegisterForm.jsx'
import Homepage from "./pages/home.jsx";
import AdminUserManage from './pages/AdminUserManage.jsx'
import EventPage from "./pages/event.jsx";
import MyEvents from "./pages/myEvents.jsx";
import SavedEvents from "./pages/savedEvents.jsx";

/* Create a page for each main view and then link it here! It will be accessible at localhost/pageName */

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<RegisterForm />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/adminManage" element={<AdminUserManage/>} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/savedevents" element={<SavedEvents />} />
      </Routes> 
      
      
    </>
  )
}

export default App;

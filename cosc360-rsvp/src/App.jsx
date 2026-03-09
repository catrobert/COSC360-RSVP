import { Routes, Route } from "react-router-dom";
import './css/App.css'
import RegisterForm from './components/RegisterForm.jsx'
import Homepage from "./pages/home.jsx";
import AdminUserManage from './pages/AdminUserManage.jsx'
import EventPage from "./pages/event.jsx";

/* Create a page for each main view and then link it here! It will be accessible at localhost/pageName */

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<RegisterForm />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/adminManage" element={<AdminUserManage/>} />
        <Route path="/event" element={<EventPage />} />
      </Routes> 
      
      
    </>
  )
}

export default App;

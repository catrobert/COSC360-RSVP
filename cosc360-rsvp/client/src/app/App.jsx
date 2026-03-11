import { Routes, Route } from "react-router-dom";
import './css/App.css'
import RegisterForm from '../client/components/RegisterForm.jsx'
import Homepage from "../../../src/pages/home.jsx";
import AdminUserManage from '../features/adminManagement/AdminUserManage.jsx'
import EventPage from "../features/event/event.jsx";

import MyEvents from "../../../src/pages/myEvents.jsx";
import SavedEvents from "../../../src/pages/savedEvents.jsx";
import Login from "../features/login/Login.jsx";


/* Create a page for each main view and then link it here! It will be accessible at localhost/pageName */

function App() {

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/adminManage" element={<AdminUserManage/>} />
        <Route path="/event" element={<EventPage />} />

        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/savedevents" element={<SavedEvents />} />

        <Route path="/login" element={<Login />}/>

      </Routes> 
      
      
    </>
  )
}

export default App;

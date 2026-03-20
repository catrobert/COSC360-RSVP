import { Routes, Route } from "react-router-dom";
import './App.css'
import RegisterForm from '../features/register/RegisterForm.jsx'
import Homepage from "../pages/home.jsx";
import AdminUserManage from '../features/adminManagement/AdminUserManage.jsx'
import SingleEventPage from "../pages/event.jsx";
import MyEvents from "../pages/myEvents.jsx";
import SavedEvents from "../pages/savedEvents.jsx";
import Login from "../features/login/Login.jsx";
import ResetPassword from "../features/login/ResetPassword.jsx";


/* Create a page for each main view and then link it here! It will be accessible at localhost/pageName */

function App() {

  return (
    <>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/adminManage" element={<AdminUserManage/>} />
        <Route path="/event/:id" element={<SingleEventPage />} />

        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/savedevents" element={<SavedEvents />} />

        <Route path="/login" element={<Login />}/>

        <Route path="/reset-password" element={<ResetPassword/>} />

      </Routes> 
      
      
    </>
  )
}

export default App;

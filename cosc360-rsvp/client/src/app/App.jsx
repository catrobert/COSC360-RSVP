import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import RegisterForm from '../features/register/RegisterForm.jsx'
import Homepage from "../pages/home.jsx";
import AdminUserManage from '../features/adminManagement/AdminUserManage.jsx'
import SingleEventPage from "../pages/event.jsx";
import MyEvents from "../pages/myEvents.jsx";
import SavedEvents from "../pages/savedEvents.jsx";
import Login from "../features/login/Login.jsx";
import ResetPassword from "../features/login/ResetPassword.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";


/* Create a page for each main view and then link it here! It will be accessible at localhost/pageName */

function App() {

  return (
    <>
      <Routes>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes - Unregistered User Pages to Go here too?*/}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/reset-password" element={<ResetPassword/>} />


        {/* Protected Routes - Require Auth to Access*/}
        <Route path="/myevents" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
        <Route path="/savedevents" element={<ProtectedRoute><SavedEvents /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/adminManage" element={<ProtectedRoute><AdminUserManage/></ProtectedRoute>} />
        <Route path="/event/:id" element={<ProtectedRoute><SingleEventPage /></ProtectedRoute>} />

      </Routes> 
      
      
    </>
  )
}

export default App;

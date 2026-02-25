import { Routes, Route } from "react-router-dom";
import './css/App.css'
import RegisterForm from './components/RegisterForm.jsx'
import Homepage from "./pages/home.jsx";

/* Create a page for each main view and then link it here! It will be accessible at localhost/pageName */

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<RegisterForm />} />
        <Route path="/home" element={<Homepage />} />
      </Routes> 
      
      
    </>
  );
}

export default App;

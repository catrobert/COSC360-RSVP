import {useState} from "react";
import "./RegisterForm.css";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "./api/Register.js";


function RegisterForm(){

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passConfirmation, setPassConfirmation] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

    //validation

    if(password !== passConfirmation){
        setError("Passwords don't match");
        return;
    }

    try{
        await registerApi(firstName, lastName, username, password);
        navigate("/login"); //if successful, navigate to login

    }catch(err){
        setError(err.message);
    }
}

    return(
        <div className="auth-background">
        <div className="form-container">
            <h2 id = "registerTitle">Create An Account</h2>
            
            <form id = "register" onSubmit={handleSubmit}> 
                <div className = "form-Input">
                    <input 
                    type = "text" 
                    id = "firstName" 
                    placeholder = "First Name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required />
                </div>

                <div className = "form-Input">
                    <input
                    type = "text"
                    id = "lastName"
                    placeholder = "Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required />
                </div>

                <div className = "form-Input">
                    <input
                    type = "text"
                    id = "username"
                    placeholder = "Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required />
                </div>

                <div className = "form-Input">
                    <input
                    type = "password"
                    id = "password"
                    placeholder = "Enter a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                </div>

        
                <div className = "form-Input">
                    <input
                    type = "password"
                    id = "passConfirmation"
                    placeholder = "Re-Enter Password"
                    value={passConfirmation}
                    onChange={(e) => setPassConfirmation(e.target.value)}
                    required />
                </div>   

            
                <div className="form-button">
                    <button type="submit" id="create-accountBtn">Create Account</button>
                </div>   

                <div>
                    <p>Already Have an Account?</p>
                    <Link to="/login">Login</Link>
                </div>    
            </form>

            
        </div>
        </div>
    );
}


export default RegisterForm;

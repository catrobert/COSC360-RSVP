import {useState} from "react";
import "./RegisterForm.css";
import { Link } from "react-router-dom";


function RegisterForm(){

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    return(
        <div className="auth-background">
        <div className="form-container">
            <h2 id = "registerTitle">Create An Account</h2>
            
            <form id = "register"> 
                <div className = "form-Input">
                    <input 
                    type = "text" 
                    id = "firstName" 
                    placeholder = "First Name" 
                    required />
                </div>

                <div className = "form-Input">
                    <input
                    type = "text"
                    id = "lastName"
                    placeholder = "Last Name"
                    required />
                </div>

                <div className = "form-Input">
                    <input
                    type = "text"
                    id = "userName"
                    placeholder = "Username"
                    required />
                </div>

                <div className = "form-Input">
                    <input
                    type = "password"
                    id = "password"
                    placeholder = "Enter a password"
                    required />
                </div>

        
                <div className = "form-Input">
                    <input
                    type = "password"
                    id = "passConfirmation"
                    placeholder = "Re-Enter Password"
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

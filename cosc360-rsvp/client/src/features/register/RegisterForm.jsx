import {useState} from "react";
import "./RegisterForm.css";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "./api/Register.js";


function RegisterForm(){

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passConfirmation, setPassConfirmation] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

    //validation

    const usernameRegex = /^[a-z]\w{4,15}$/i; // start with a letter, 5-16 chars long, case insensitive
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])\S{8,16}$/; // at least 8-16 chars long, at least one number and one letter, no spaces

    if (!usernameRegex.test(username)) {
        setError("Username must start with a letter and be 5-16 characters long")
        return;
    }

    if (!passwordRegex.test(password) || !passwordRegex.test(passConfirmation)) {
        setError("Password must contain at least one number and one letter, and be 8-16 characters long");
        return;
    }

    if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
    }

    if(password !== passConfirmation){
        setError("Passwords don't match");
        return;
    }

    if (!profilePhoto) {
        setError("Please upload a profile image");
        return;
    }

    try{
        await registerApi(firstName, lastName, username, email, password, profilePhoto);
        navigate("/login"); //if successful, navigate to login
        alert('Account creation successful!');


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
                    type = "email"
                    id = "email"
                    placeholder = "Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <div className = "form-Input">
                    <input
                    type = "file"
                    id = "profilePhoto"
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                    required />
                </div>

                <p style={{color: 'red', fontSize: '12px', paddingTop: '10px'}}>{error}</p>
            
                <div className="form-button">
                    <button type="submit" id="create-accountBtn">Create Account</button>
                </div>   

                <div>
                    <p>Already Have an Account?</p>
                    <Link to="/login">Login</Link>
                    <br></br>
                    <Link to="/home">Continue as Guest</Link>
                </div>    
            </form>

            
        </div>
        </div>
    );
}


export default RegisterForm;

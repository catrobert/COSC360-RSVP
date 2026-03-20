import { useState } from "react";
import "./LoginCard.css";
import { loginApi } from "./api/Login.js";
import { Link } from "react-router-dom";


function LoginCard(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

  async function handleSubmit(e){
    e.preventDefault();

    try{
      const data = await loginApi(username, password); 
      setMessage(data.message);
    }catch (error){
      setMessage(error.message);
    }

  }  

  return (
    <div className = "auth-background">
    <div className="login-container">

        <form id= "login" onSubmit={handleSubmit}>
            <h2 className = "title">Welcome Back!</h2>
            <input className="textField"
             type="text"
             placeholder="Username"
             value={username}
             onChange={(e)=>setUsername(e.target.value)}/>

            <input className="textField"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}/>

            <button id = "login-btn" type="submit">Login</button> 
            <Link to="/reset-password" id="forgotPassword">Forgot Password?</Link> 
            <Link to="/register">Create Account</Link>

            <p>{message}</p> 
        </form>

    </div>
    </div>
  )
}

export default LoginCard;
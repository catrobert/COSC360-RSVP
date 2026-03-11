import { useState } from "react";
import "./LoginCard.css";
import { loginApi } from "./api/Login.js";


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
            <a id="forgotPassword">Forgot Password?</a> 
            <a id="createAccount">Create Account</a>

            <p>{message}</p> 
        </form>

    </div>
  )
}

export default LoginCard;
import { useState } from "react";
import "../../css/LoginCard.css";
import { Italic } from "lucide-react";


function LoginCard(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

  async function handleSubmit(e){
    e.preventDefault();

    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    });

    const data = await response.json();
    setMessage(data.message);

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
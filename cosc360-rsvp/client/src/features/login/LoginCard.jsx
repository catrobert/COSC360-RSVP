import { useState } from "react";
import "./LoginCard.css";
import { loginApi } from "./api/Login.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";



function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await loginApi(username, password);
      login(data.user);
      setMessage(data.message);

      navigate("/home");
    } catch (error) {
      setMessage(error.message);
    }

  }

  return (
    <div className="auth-background">
      <div className="login-container">

        <form id="login" onSubmit={handleSubmit}>
          <h2 className="title">Welcome Back!</h2>
          <input className="textField"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} />

          <input className="textField"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />

          <button id="login-btn" type="submit">Login</button>
          <Link to="/reset-password" id="forgotPassword">Forgot Password?</Link>
          <Link to="/register">Create Account</Link>

          <p>{message}</p>
        </form>

      </div>
    </div>
  )
}

export default LoginCard;
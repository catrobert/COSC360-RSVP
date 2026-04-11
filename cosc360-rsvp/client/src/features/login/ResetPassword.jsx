import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPass } from "./api/Reset.js";
import "./ResetPassword.css";

function ResetPassword() {
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!username.trim() || !newPassword || !confirmPassword) {
            setMessage("Username, newPassword, and confirmPassword are required");
            return;
        }

        if (newPassword.length < 8) {
            setMessage("Password must be at least 8 characters");
            return;
        }

        if (newPassword.length > 72) {
            setMessage("Password must be 72 characters or fewer");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match");
            return;
        }

        try {
            const data = await resetPass(username, newPassword, confirmPassword);
            setMessage(data.message);

            if (data.success) {
                navigate("/login");
            }
        } catch (error) {
            setMessage(error.message || "Something went wrong");
        }

    }

    return (
        <div className="auth-background">
            <div className="login-container">
                <form id="reset-password" onSubmit={handleSubmit}>
                    <h2 className="title">Reset Password</h2>
                    <input className="textField" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    <input className="textField" type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
                    <input className="textField" type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />
                    <button id="reset-btn">Reset Password</button>

                    <p>{message}</p>
                </form>
            </div>
        </div>
    );

}
export default ResetPassword;
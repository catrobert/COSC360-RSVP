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
            setMessage("All fields are required");
            return;
        }


        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])\S{8,16}$/; // at least 8-16 chars long, at least one number and one letter, no spaces

        if (!passwordRegex.test(newPassword) || !passwordRegex.test(confirmPassword)) {
            setMessage("Password must contain at least one number and one letter, and be 8-16 characters long");
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

                    <p style={{color: 'red', textAlign:'center'}}>{message}</p>
                </form>
            </div>
        </div>
    );

}
export default ResetPassword;
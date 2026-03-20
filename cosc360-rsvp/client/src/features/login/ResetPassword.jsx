import { useState } from "react";
import {useNavigate} from "react-router-dom";

function ResetPassword(){
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const[error,setError] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async() => {
       const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, newPassword, confirmPassword })
       });

       const data = await res.json();

       if (data.success){
        navigate("/login");
       }else{
        setError(data.error || "Something went wrong");
       }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input placeholder="Username" onChange={e => setUsername(e.target.value)}/>
            <input type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)}/>
            <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)}/>
            <button onClick={handleResetPassword}>Reset Password</button>
        </div>
    );
}

export default ResetPassword;
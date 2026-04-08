import LoginCard from "../features/login/LoginCard.jsx";
import "../css/LoginOverlay.css";

function LoginOverlay({ onClose }){
    return(
        <div className="login-overlay-bg" onClick={onClose}>
            <div onClick={(e)=> e.stopPropagation()}>
                <LoginCard
                    onSuccess={onClose}
                    onClose={onClose}
                />
            </div>
        </div>
    )
}

export default LoginOverlay;
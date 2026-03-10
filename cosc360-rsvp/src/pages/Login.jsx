import Login from "../components/login/LoginCard.jsx";
import "../css/LoginCard.css"

function LoginPage(){
    return(
        <div className="page-container">
            <div id="loginComponent">
                <Login />
            </div>
        </div>
    );
}

export default LoginPage;
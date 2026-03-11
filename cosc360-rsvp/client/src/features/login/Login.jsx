import Login from "./LoginCard.jsx";
import "./LoginCard.css"

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
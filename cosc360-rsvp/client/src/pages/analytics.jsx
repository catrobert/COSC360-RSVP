import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";

function Analytics() {
    return (
        <div className="homepage-layout">
            <AdminSidebar />
            <div className="main-content">
                <TopNav />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                    <h2 style={{ color: "#888" }}>Analytics — Not Implemented Yet</h2>
                </div>
            </div>
        </div>
    );
}

export default Analytics;

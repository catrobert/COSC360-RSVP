import EventContainer from "../features/event/homepageEvents/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import '../css/index.css'
import { useAuth } from "../context/AuthContext.jsx";

// TODO: if is saved, fill in saved icon. easier to implement with database

function SavedEvents() {
    const { user } = useAuth();
    return (
        <div style= {{ display: "flex", flexDirection: "row", width: "100%" }}>        
            {user?.role === 'admin' ? ( <AdminSidebar /> ) : ( <Sidebar /> )}
            <div style= {{ display: "flex", flexDirection: "column", flex: "1" }}>
                <TopNav />
                <h1 style={{ margin: "12px 0 16px 24px", fontFamily: "inherit" }}>Saved Events</h1>
                <EventContainer events={[]}/>
            </div>
        </div>
    );
}

export default SavedEvents;
import EventContainer from "../../client/components/event_cards/EventContainer";
import Sidebar from "../../client/components/sidebar";
import AdminSidebar from "../../client/components/AdminSidebar";
import TopNav from "../../client/components/topNav";
import '../css/index.css'

const username = "Lexi Loudiadis"
const isAdmin = false;

// TODO: if is saved, fill in saved icon. easier to implement with database

function SavedEvents() {
    return (
        <div style= {{ display: "flex", flexDirection: "row", width: "100%" }}>        
            {isAdmin ? ( <AdminSidebar user= { username } /> ) : ( <Sidebar user = { username } /> )}
            <div style= {{ display: "flex", flexDirection: "column", flex: "1" }}>
                <TopNav />
                <h1 style={{ margin: "12px 0 16px 24px", fontFamily: "inherit" }}>Saved Events</h1>
                <EventContainer />
            </div>
        </div>
    );
}

export default SavedEvents;
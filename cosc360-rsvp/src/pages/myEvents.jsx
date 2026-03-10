import EventContainer from "../components/event_cards/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import '../css/myEvents.css'


const username = "Lexi Loudiadis"
const isAdmin = false;

function MyEvents() {
    return (
        <div style= {{ display: "flex", flexDirection: "row", width: "100%" }}>        
            {isAdmin ? ( <AdminSidebar user= { username } /> ) : ( <Sidebar user = { username } /> )}
            <div style= {{ display: "flex", flexDirection: "column", flex: "1" }}>
                <TopNav />
                <h1>Upcoming Hosting Events</h1>
                <EventContainer />
                <h1>Upcoming Attending Events</h1>
                <EventContainer />
            </div>
        </div>
    );
}

export default MyEvents;
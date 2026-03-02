import EventContainer from "../components/event_cards/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/adminSidebar";
import TopNav from "../components/topNav";

const username = "Lexi Loudiadis"

function Homepage() {
    return (
        <div style= {{ display: "flex", flexDirection: "row", width: "100%" }}>        
            <AdminSidebar user= { username } />
            <div style= {{ display: "flex", flexDirection: "column", flex: "1" }}>
                <TopNav />
                <EventContainer />
            </div>
        </div>
    );
}

export default Homepage;
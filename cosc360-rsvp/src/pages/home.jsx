import EventContainer from "../components/event_cards/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/adminSidebar";

const username = "Lexi Loudiadis"

function Homepage() {
    return (
        <div style= {{ display: "flex" }}>
            <AdminSidebar user= { username } />
            <EventContainer />
        </div>
    );
}

export default Homepage;
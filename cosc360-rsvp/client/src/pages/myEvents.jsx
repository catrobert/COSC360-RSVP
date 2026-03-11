import EventContainer from "../features/event/event_cards/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";


const username = "Lexi Loudiadis"
const isAdmin = false;

// todo: if previously attended event, swap out review stars for "Leave a Review" button

function MyEvents() {
    return (
        <div style= {{ display: "flex", flexDirection: "row", width: "100%" }}>        
            {isAdmin ? ( <AdminSidebar user= { username } /> ) : ( <Sidebar user = { username } /> )}
            <div style= {{ display: "flex", flexDirection: "column", flex: "1" }}>
                <TopNav />
                <h1 style= {{ margin: "12px 0 16px 24px", fontFamily: "inherit" }}>Upcoming Hosting Events</h1>
                <EventContainer events={[]} />
                <h1 style= {{ margin: "36px 0 16px 24px", fontFamily: "inherit" }}>Upcoming Attending Events</h1>
                <EventContainer events={[]}/>
                <h1 style= {{ margin: "36px 0 16px 24px", fontFamily: "inherit" }}>Previously Hosted Events</h1>
                <EventContainer events={[]}/>
                <h1 style= {{ margin: "36px 0 16px 24px", fontFamily: "inherit" }}>Previous Attended Events</h1>
                <EventContainer events={[]}/>
            </div>
        </div>
    );
}

export default MyEvents;
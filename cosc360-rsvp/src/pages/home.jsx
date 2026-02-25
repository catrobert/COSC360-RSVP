import EventContainer from "../components/event_cards/EventContainer";
import Sidebar from "../components/sidebar";

const username = "Lexi Loudiadis"

function Homepage() {
    return (
        <div style= {{ display: "flex" }}>
            <Sidebar user= { username } />
            <EventContainer />
        </div>
    );
}

export default Homepage;
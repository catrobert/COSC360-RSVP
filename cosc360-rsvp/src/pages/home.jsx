import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EventContainer from "../../client/components/event_cards/EventContainer";
import Sidebar from "../../client/components/sidebar";
import AdminSidebar from "../../client/components/AdminSidebar";
import TopNav from "../../client/components/topNav";

const username = "Lexi Loudiadis"
const isAdmin = false;

function Homepage() {
    const [events, setEvents] = useState([]);
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q"); // get the search params sent over from search bar in top nav component

    useEffect( () => {
        async function fetchEvents() {
            try {
                let url = "http://localhost:3000/events";
            
                if (query) {
                    url += `?q=${query}`;
                }

                const response = await fetch(url);
                const data = await response.json();

                setEvents(data.events ?? data);

            } catch (e) {
                console.log("Error fetching events: " + e);
            }
        }

        fetchEvents();

    }, [query]) 

    return (
        <div style= {{ display: "flex", flexDirection: "row", width: "100%" }}>        
            {isAdmin ? ( <AdminSidebar user= { username } /> ) : ( <Sidebar user = { username } /> )}
            <div style= {{ display: "flex", flexDirection: "column", flex: "1" }}>
                <TopNav />
                <EventContainer events={events} />
            </div>
        </div>
    );
}

export default Homepage;
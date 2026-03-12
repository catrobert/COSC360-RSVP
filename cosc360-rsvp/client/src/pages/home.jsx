import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EventContainer from "../features/event/event_cards/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";

const username = "Lexi Loudiadis"
const isAdmin = false;

function Homepage() {
    const [events, setEvents] = useState([]);
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q"); // get the search params sent over from search bar in top nav component

    useEffect( () => {
        async function fetchEvents() {
            try {
                let url = "/api/events";
            
                if (query) {
                    url += `?q=${query}`;
                }

                const response = await fetch(url);
                const data = await response.json();

                if (!response.ok) {
                    console.log("Error fetching events:", data.error);
                    return;
                }

                setEvents(data.events ?? data);

            } catch (e) {
                console.log("Error fetching events: " + e);
            }
        }

        fetchEvents();

    }, [query]) 

    return (
        <div className="homepage-layout">        
            {isAdmin ? ( <AdminSidebar user= { username } /> ) : ( <Sidebar user = { username } /> )}
            <div className="main-content">
                <TopNav />
                <EventContainer events={events} />
            </div>
        </div>
    );
}

export default Homepage;
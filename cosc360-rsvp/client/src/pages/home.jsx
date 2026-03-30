import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EventContainer from "../features/event/homepageEvents/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";
import { useAuth } from "../context/AuthContext.jsx";

function Homepage() {
    const [events, setEvents] = useState([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const query = searchParams.get("q"); // get the search params sent over from search bar in top nav component

    function handleEventClick (eventId) {
        navigate(`/event/${eventId.toString()}`);
    }


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
                    console.log("Error fetching events: ", data.error);
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
            {user?.role === 'admin' ? ( <AdminSidebar /> ) : ( <Sidebar /> )}
            <div className="main-content">
                <TopNav />
                <EventContainer events={events} onEventClick={handleEventClick} />
            </div>
        </div>
    );
}

export default Homepage;
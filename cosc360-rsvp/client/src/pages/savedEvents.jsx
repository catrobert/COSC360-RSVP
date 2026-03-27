import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventContainer from "../features/event/homepageEvents/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";
import '../css/index.css'
import { useAuth } from "../context/AuthContext.jsx";

function SavedEvents() {
    const [savedEvents, setSavedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    function handleEventClick(eventId) {
        navigate(`/event/${eventId}`);
    }

    useEffect(() => {
        async function fetchSavedEvents() {
            // Use the active user id header required by RSVP middleware.
            const userId = localStorage.getItem("userId") || "000000000000000000000001";

            try {
                const response = await fetch("/api/rsvp/events?status=saved", {
                    headers: {
                        "x-user-id": userId,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    console.log("Error fetching saved events:", data.error);
                    setSavedEvents([]);
                    return;
                }

                // RSVP rows include populated event objects under eventId.
                const events = (data.events || [])
                    .map((rsvp) => rsvp?.eventId)
                    .filter(Boolean);

                setSavedEvents(events);
            } catch (error) {
                console.log("Error fetching saved events:", error);
                setSavedEvents([]);
            } finally {
                setLoading(false);
            }
        }

        fetchSavedEvents();
    }, []);

    return (
        <div className="homepage-layout">        
            {isAdmin ? ( <AdminSidebar user= { username } /> ) : ( <Sidebar user = { username } /> )}
            <div className="main-content">
//     const { user } = useAuth();
//     return (
//         <div style= {{ display: "flex", flexDirection: "row", width: "100%" }}>        
//             {user?.role === 'admin' ? ( <AdminSidebar /> ) : ( <Sidebar /> )}
//             <div style= {{ display: "flex", flexDirection: "column", flex: "1" }}>
                <TopNav />
                <h1 style={{ margin: "12px 0 16px 24px", fontFamily: "inherit" }}>Saved Events</h1>
                {loading ? (
                    <p style={{ marginLeft: "24px" }}>Loading...</p>
                ) : savedEvents.length === 0 ? (
                    <p style={{ marginLeft: "24px" }}>No saved events yet.</p>
                ) : (
                    <EventContainer events={savedEvents} onEventClick={handleEventClick} />
                )}
            </div>
        </div>
    );
}

export default SavedEvents;
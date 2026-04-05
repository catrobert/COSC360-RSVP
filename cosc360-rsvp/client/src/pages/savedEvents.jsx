import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
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
    const { user } = useAuth();
    const activeUserId = user?.id || user?._id;
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    function handleEventClick(eventId) {
        navigate(`/event/${eventId}`);
    }

    useEffect(() => {
        async function fetchSavedEvents() {
            if (!activeUserId) {
                setSavedEvents([]);
                setLoading(false);
                return;
            }

            setLoading(true);

            const params = new URLSearchParams({ status: "saved" });
            if (query.trim()) {
                params.set("q", query.trim());
            }

            try {
                const response = await fetch(`/api/rsvp/events?${params.toString()}`, {
                    headers: {
                        "x-user-id": activeUserId,
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
    }, [query, activeUserId]);

    return (
        <div className="homepage-layout">
            {user?.role === 'admin' ? (<AdminSidebar />) : (<Sidebar />)}
            <div className="main-content">
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
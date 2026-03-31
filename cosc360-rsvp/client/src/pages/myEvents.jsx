import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventContainer from "../features/event/homepageEvents/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";
import { useAuth } from "../context/AuthContext.jsx";

// todo: if previously attended event, swap out review stars for "Leave a Review" button

function MyEvents() {
    const [upcomingHostedEvents, setUpcomingHostedEvents] = useState([]);
    const [upcomingAttendingEvents, setUpcomingAttendingEvents] = useState([]);
    const [previousHostedEvents, setPreviousHostedEvents] = useState([]);
    const [previousAttendedEvents, setPreviousAttendedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    function isUpcoming(eventDate, endTime) {
        const [hours, minutes] = endTime.split(':');
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(hours, minutes);

        return eventDateTime > new Date();
    }

    function handleEventClick(eventId) {
        navigate(`/event/${eventId}`);
    }

    useEffect(() => {
        async function fetchMyEvents() {
            const userId = localStorage.getItem("userId") || "000000000000000000000001";

            try {
                // Pull all events for hosted sections and RSVP yes rows for attending sections.
                const [allEventsResponse, attendingResponse] = await Promise.all([
                    fetch("/api/events"),
                    fetch("/api/rsvp/events?status=yes", {
                        headers: {
                            "x-user-id": userId,
                        },
                    }),
                ]);

                const allEventsData = await allEventsResponse.json();
                const attendingData = await attendingResponse.json();

                const allEvents = allEventsData.events ?? allEventsData;
                const attendingEvents = (attendingData.events || [])
                    .map((rsvp) => rsvp?.eventId)
                    .filter(Boolean);

                // Hosted events are the events created by the active user.
                const hostedEvents = (allEvents || []).filter(
                    (event) => event?.createdBy?.toString?.() === userId
                );

                // Split each bucket into upcoming and previous by event date.
                setUpcomingHostedEvents(hostedEvents.filter((event) => isUpcoming(event.date, event.endTime)));
                setPreviousHostedEvents(hostedEvents.filter((event) => !isUpcoming(event.date, event.endTime)));
                setUpcomingAttendingEvents(attendingEvents.filter((event) => isUpcoming(event.date, event.endTime)));
                setPreviousAttendedEvents(attendingEvents.filter((event) => !isUpcoming(event.date, event.endTime)));
            } catch (error) {
                console.log("Error fetching My Events data:", error);
                setUpcomingHostedEvents([]);
                setPreviousHostedEvents([]);
                setUpcomingAttendingEvents([]);
                setPreviousAttendedEvents([]);
            } finally {
                setLoading(false);
            }
        }

        fetchMyEvents();
    }, []);

    const { user } = useAuth();

    return (
        <div className="homepage-layout">        
            {user?.role === 'admin' ? ( <AdminSidebar /> ) : ( <Sidebar /> )}
            <div className="main-content">
                <TopNav />
                <h1 style= {{ margin: "12px 0 16px 24px", fontFamily: "inherit" }}>Upcoming Hosting Events</h1>
                {loading ? <p style={{ marginLeft: "24px" }}>Loading...</p> : <EventContainer events={upcomingHostedEvents} onEventClick={handleEventClick} />}
                <h1 style= {{ margin: "36px 0 16px 24px", fontFamily: "inherit" }}>Upcoming Attending Events</h1>
                {loading ? <p style={{ marginLeft: "24px" }}>Loading...</p> : <EventContainer events={upcomingAttendingEvents} onEventClick={handleEventClick} />}
                <h1 style= {{ margin: "36px 0 16px 24px", fontFamily: "inherit" }}>Previously Hosted Events</h1>
                {loading ? <p style={{ marginLeft: "24px" }}>Loading...</p> : <EventContainer events={previousHostedEvents} onEventClick={handleEventClick} />}
                <h1 style= {{ margin: "36px 0 16px 24px", fontFamily: "inherit" }}>Previously Attended Events</h1>
                {loading ? <p style={{ marginLeft: "24px" }}>Loading...</p> : <EventContainer events={previousAttendedEvents} onEventClick={handleEventClick} />}
            </div>
        </div>
    );
}

export default MyEvents;

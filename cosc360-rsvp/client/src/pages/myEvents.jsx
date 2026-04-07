import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import EventContainer from "../features/event/homepageEvents/EventContainer";
import Sidebar from "../components/sidebar";
import AdminSidebar from "../components/AdminSidebar";
import TopNav from "../components/topNav";
import "../css/Home.css";
import { useAuth } from "../context/AuthContext.jsx";
import ReviewModal from "../features/event/reviews/ReviewModal.jsx";
import CreateEventForm from "../features/event/createEvent/CreateEventForm.jsx";

// todo: if previously attended event, swap out review stars for "Leave a Review" button

function MyEvents() {
    const [upcomingHostedEvents, setUpcomingHostedEvents] = useState([]);
    const [upcomingAttendingEvents, setUpcomingAttendingEvents] = useState([]);
    const [previousHostedEvents, setPreviousHostedEvents] = useState([]);
    const [previousAttendedEvents, setPreviousAttendedEvents] = useState([]);
    const [reviewingEvent, setReviewingEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteRsvp, setDeleteRsvp] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    async function handleDeleteRsvpClick (event) {
        // setDeleteRsvp(event)
        const response = await fetch(`/api/rsvp/${event._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-ider": user._id || user.id,
            },
        });

        const result = await response.json();

    }

    const handleReviewClick = function(event) {
        setReviewingEvent(event);  
    }

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

            const eventParams = new URLSearchParams();
            if (query.trim()) {
                eventParams.set("q", query.trim());
            }

            const rsvpParams = new URLSearchParams({ status: "yes" });
            if (query.trim()) {
                rsvpParams.set("q", query.trim());
            }

            try {
                // Pull all events for hosted sections and RSVP yes rows for attending sections.
                const [allEventsResponse, attendingResponse] = await Promise.all([
                    fetch(`/api/events${eventParams.toString() ? `?${eventParams.toString()}` : ""}`),
                    fetch(`/api/rsvp/events?${rsvpParams.toString()}`, {
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
                setLoading(false);
            } catch (error) {
                console.log("Error fetching My Events data:", error);
                setUpcomingHostedEvents([]);
                setPreviousHostedEvents([]);
                setUpcomingAttendingEvents([]);
                setPreviousAttendedEvents([]);
            }
        }

        fetchMyEvents();
    }, [query]);

    return (
        <div className="homepage-layout">        
            {user?.role === 'admin' ? ( <AdminSidebar /> ) : ( <Sidebar /> )}
            <div className="main-content">
                <TopNav />
                <h1 style= {{ margin: "12px 0 16px 24px", fontFamily: "inherit" }}>Upcoming Hosting Events</h1>
                {loading ? <p style={{ marginLeft: "24px" }}>Loading...</p> : <EventContainer events={upcomingHostedEvents} onEventClick={handleEventClick} onEditClick={(event) => setEditingEvent(event)} />}
                <h1 style= {{ margin: "36px 0 16px 24px", fontFamily: "inherit" }}>Upcoming Attending Events</h1>
                {loading ? <p style={{ marginLeft: "24px" }}>Loading...</p> : <EventContainer events={upcomingAttendingEvents} onEventClick={handleEventClick} showDeleteRsvpButton={true} onDeleteRsvpClick={handleDeleteRsvpClick}/>}
                <h1 style= {{ margin: "36px 0 16px 24px", fontFamily: "inherit" }}>Previously Hosted Events</h1>
                {loading ? <p style={{ marginLeft: "24px" }}>Loading...</p> : <EventContainer events={previousHostedEvents} onEventClick={handleEventClick} onEditClick={(event) => setEditingEvent(event)} />}
                <h1 style= {{ margin: "36px 0 16px 24px", fontFamily: "inherit" }}>Previously Attended Events</h1>
                {loading ? <p style={{ marginLeft: "24px" }}>Loading...</p> : <EventContainer events={previousAttendedEvents} onEventClick={handleEventClick} showReviewButton={true} onReviewClick={handleReviewClick}/>}
            </div>

            {reviewingEvent && <ReviewModal event={reviewingEvent} onClose={() => setReviewingEvent(null)}/>}
            {editingEvent && <CreateEventForm initialData={editingEvent} eventId={editingEvent._id} onClose={(updated) => { setEditingEvent(null); }} />}
        </div>
    );
}

export default MyEvents;

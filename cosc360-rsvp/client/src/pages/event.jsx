import ReviewCard from "../features/event/singleEvent/ReviewCard";
import SingleEventContainer from "../features/event/singleEvent/SingleEventContainer";
import TopNav from "../components/topNav";
import Sidebar from "../components/sidebar";
import "../css/Home.css";
import "../css/Event.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const loggedInUser = "000000000000000000000001"; // hardcoded for now

function EventPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const userCreated = function (userId = "000000000000000000000001") { // hardcoded for now
        if (loggedInUser === userId) {
            return true;
        }
        return false;
    }

    async function handleDeleteEventClick() {
        try {
            const response = await fetch (`/api/events/${id}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (!response.ok) {
                alert(`Something went wrong: ${result.error}`);
                return;
            }

            alert("Deleted event successfully.")
        } catch (error) {
            console.log("Error deleting event: ", error);
        }
    }
    const { user } = useAuth();
    
    async function handleRsvpClick() {
        // Use logged in user id when available and keep demo fallback for local testing.
        const userId = localStorage.getItem("userId") || "000000000000000000000001";

        // Create a yes RSVP for this event id.
        const data = {
            eventId: id,
            status: "yes",
        };

        try {
            const response = await fetch("/api/rsvp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.status === 400) {
                alert(`${result.error} \nNavigate to "My Events" to view.`);
                return;
            }

            if (!response.ok) {
                alert(`Something went wrong: ${result.error}`);
                return;
            }

            alert('RSVP successful! Navigate to "My Events" to view.');
            
        } catch (error) {
            console.log("Error RSVP-ing to event: ", error);
        }
    }


    useEffect( () => {
        async function fetchEvent() {
            try {
                let url = `/api/events/${id}`;
                const response = await fetch(url);
                const data = await response.json();

                if (!response.ok) {
                    console.log("Error fetching event: ", data.error);
                    return;
                }
            
                setEvent(data);

            } catch (e) {
                console.log("Error fetching events: " + e);
            }      
        }

        fetchEvent();

    }, [id]);

    if (!event) {
        return (
            <div className="homepage-layout">
                <Sidebar />
                <div className="main-content">
                    <TopNav />
                    <div className="main-content-area">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage-layout">
            <Sidebar />
            <div className="main-content">
            <TopNav />
                <div id="event-header">
                    <h1 id= "event-page-title">{event.name}</h1>
                    {userCreated() && (<button id="delete-button" onClick={handleDeleteEventClick}>Delete Event</button>)}
                </div>
                <div className="event-page-content">
                    <SingleEventContainer event={event} onRsvpClick={handleRsvpClick} />
                    <ReviewCard reviews={event.reviews} />
                </div>
            </div>
        </div>
    );
}

export default EventPage;
import ReviewCard from "../features/event/singleEvent/ReviewCard";
import SingleEventContainer from "../features/event/singleEvent/SingleEventContainer";
import TopNav from "../components/topNav";
import Sidebar from "../components/sidebar";
import '../css/Event.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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

    }
    
    async function handleRsvpClick() {
        const data = {
            eventId: id,
            userId: "000000000000000000000001", // placeholder till we have login and can track userId
            status: "yes",
        };

        try {
            const response = await fetch("/api/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

    if (!event) return <p>Loading...</p>;

    return (
        <div id="page-container">
            <Sidebar id="main-sidebar" />
            <div id="event-page">
                <TopNav />
                <div id="event-header">
                    <h1 id="event-title">{event.name}</h1>
                    {userCreated && (<button id="delete-button" onClick={handleDeleteEventClick}>Delete Event</button>)}
                </div>
                <div id="event-content">
                    <SingleEventContainer event={event} onRsvpClick={handleRsvpClick} /> {/* createdByUser={userCreated} onDeleteEventClick={handleDeleteEventClick} /> */}
                    <ReviewCard reviews={event.reviews} />
                </div>
            </div>
        </div>
    );
}

export default EventPage;
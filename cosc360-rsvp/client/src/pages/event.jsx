import ReviewCard from "../features/event/singleEvent/ReviewCard";
import SingleEventContainer from "../features/event/singleEvent/SingleEventContainer";
import TopNav from "../components/topNav";
import Sidebar from "../components/sidebar";
import '../css/Event.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


function EventPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

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
                <h1 id="event-title">{event.name}</h1>
                <div id="event-content">
                    <SingleEventContainer event={event} />
                    <ReviewCard reviews={event.reviews} />
                </div>
            </div>
        </div>
    );
}

export default EventPage;
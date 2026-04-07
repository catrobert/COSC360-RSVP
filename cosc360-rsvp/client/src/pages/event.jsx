import ReviewCard from "../features/event/reviews/ReviewCard";
import SingleEventContainer from "../features/event/singleEvent/SingleEventContainer";
import TopNav from "../components/topNav";
import Sidebar from "../components/sidebar";
import "../css/Home.css";
import "../css/Event.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ReviewModal from "../features/event/reviews/ReviewModal.jsx";
import CreateEventForm from "../features/event/createEvent/CreateEventForm.jsx";

function EventPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [reviewingEvent, setReviewingEvent] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [rsvpStatus, setRsvpStatus] = useState("");
    const { activeUser, activeUserId } = useAuth();
    const eventIsUpcoming = event ? isUpcoming(event.date, event.endTime) : false;
    const canReview = (event !== null && rsvpStatus === 'yes' && !eventIsUpcoming && !hasReviewed());

    const { user } = useAuth();

//     const hasReviewed = () => {
//         for (const review of event.reviews) {
//             if (review.userId?.toString() === user._id) {
//                 return true;
//             }
//         }
//         return false;
//     }
    
    const userCreated = function () {
        if (!activeUser || !activeUserId || !event) return false;
        const creatorId = event.createdBy?._id?.toString() || event.createdBy?.toString();
        return activeUser.role === "admin" || creatorId === activeUserId;
    }

    const eventIsUpcoming = event ? isUpcoming(event.date, event.endTime) : false;
    const canReview = (event !== null && rsvpStatus === 'yes' && !eventIsUpcoming && !hasReviewed());
    const canRsvp = (event !== null && rsvpStatus !== 'yes' && eventIsUpcoming)
  

    async function handleDeleteEventClick() {
        try {
            const response = await fetch(`/api/events/${id}`, {
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

    function hasReviewed() {
        if (!activeUserId || !event?.reviews) return false;

        for (const review of event.reviews) {
            const reviewUserId = review.userId?._id?.toString?.() || review.userId?.toString?.();
            if (reviewUserId === activeUserId.toString()) {
                return true;
            }
        }
        return false;
    }
    

    function isUpcoming(eventDate, endTime) {
        const [hours, minutes] = endTime.split(':');
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(hours, minutes);

        return eventDateTime > new Date();
    }

    useEffect(() => {
        async function fetchRSVPstatus() {
            if (!activeUserId) return;

            try {
                const response = await fetch(`/api/rsvp/events/${id}`, {
                    headers: {
                        "x-user-id": activeUserId,
                    }
                });

                const result = await response.json();

                if (result.error) {
                    alert(result.error);
                    return;
                }

                setRsvpStatus(result[0]?.status);
            } catch (error) {
                console.log("Error getting RSVP status: ", error.message);
            }
        }
        fetchRSVPstatus();
    }, [id, activeUserId])

    async function handleReviewClick() {
        if (canReview) {
            setReviewingEvent(event);
        } else if (hasReviewed()) {
            alert("You have already reviewed this event!")
        } else if (rsvpStatus === 'no' || rsvpStatus === 'saved') {
            alert("You have not RSVP'd to this event, and therefore cannot review.")
        } else if (rsvpStatus === 'yes' && eventIsUpcoming) {
            alert("Please wait until after the event to leave a review.");
        }
    }

    async function handleRsvpClick() {
        if (!eventIsUpcoming) {
            alert("The event has passed. You can no longer RSVP.");
            return;
        }

        // Use logged in user id when available and keep demo fallback for local testing.
        const userId = localStorage.getItem("userId") || "000000000000000000000001";
        if (!activeUserId) {
            alert("Please log in to RSVP.");
            return;
        }

        // Create a yes RSVP for this event id.
        const data = {
            eventId: id,
            status: "yes",
        };

        try {
            // Prefer updating an existing RSVP row (saved/no -> yes).
            let response = await fetch(`/api/rsvp/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": activeUserId,
                },
                body: JSON.stringify({ status: "yes" }),
            });

            // If there is no existing RSVP row yet, create one.
            if (response.status === 404) {
                response = await fetch("/api/rsvp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": activeUserId,
                    },
                    body: JSON.stringify(data),
                });
            }

            const result = await response.json();

            if (!response.ok) {
                alert(`Something went wrong: ${result.error}`);
                return;
            }

            setRsvpStatus("yes");
            alert('RSVP successful! Navigate to "My Events" to view.');

        } catch (error) {
            console.log("Error RSVP-ing to event: ", error);
        }
    }


    useEffect(() => {
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
                    <h1 id="event-page-title">{event.name}</h1>
                    <div className="align-btns-right">
                        {userCreated() && (<button className="event-edit-btn" onClick={() => setEditingEvent(event)}>Edit Event</button>)}
                        {userCreated() && (<button className="event-delete-btn" onClick={handleDeleteEventClick}>Delete Event</button>)}
                    </div>
                </div>
                <div className="event-page-content">
                    <SingleEventContainer event={event} ableToRsvp={canRsvp} onRsvpClick={handleRsvpClick} />
                    <ReviewCard reviews={event.reviews} onReviewClick={handleReviewClick} ableToReview={canReview} />
                </div>
                {reviewingEvent && <ReviewModal event={reviewingEvent} onClose={() => setReviewingEvent(null)} />}
                {editingEvent && <CreateEventForm initialData={editingEvent} eventId={editingEvent._id} onClose={(updated) => { setEditingEvent(null); if (updated) setEvent(updated); }} />}
            </div>
        </div>
    );
}

export default EventPage;
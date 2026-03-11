import ReviewContainer from "../../client/components/event/review_bar/ReviewContainer";
import EventContainer from "../../client/components/event/EventContainer";
import TopNav from "../../client/components/topNav";
import Sidebar from "../../client/components/sidebar";
import '../css/Event.css';

const event = {
    title: "Graduation Party",
    date: "2024-06-15",
    time: "7:00 PM",
    location: "123 Main Street",
    attendees: 100,
    host: "Kelowna Secondary School",
    image: "https://www.southernliving.com/thmb/osQ0-qCdyJmTELa8n7OnCE1cwz4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/graduates-throwing-caps-1066324992-2000-c66181da679b46dab1f62f4b2fbe3e84.jpg",
    description: "Join us for a fun graduation party with games, food, and cake! Everyone is welcome to celebrate with us. Don't forget to bring your dancing shoes! We will have a DJ playing all your favorite tunes. RSVP by June 1st to let us know you're coming. We can't wait to see you there!",
    price: "$20.00"
};

const reviews = [
    { id: 1, text: "Great event!", rating: 5, reviewerName: "Alice" },
    { id: 2, text: "Had a wonderful time.", rating: 4, reviewerName: "Bob" },
    { id: 3, text: "Would attend again.", rating: 4, reviewerName: "Charlie" },
    { id: 4, text: "Not what I expected.", rating: 2, reviewerName: "Diana" },
    { id: 5, text: "Amazing experience!", rating: 5, reviewerName: "Eve" }
];

function EventPage() {
    return (
        <div id="page-container">
            <Sidebar id="main-sidebar" />
            <div id="event-page">
                <TopNav />
                <h1 id="event-title">{event.title}</h1>
                <div id="event-content">
                    <EventContainer event={event} />
                    <ReviewContainer reviews={reviews} />
                </div>
            </div>
        </div>
    );
}

export default EventPage;
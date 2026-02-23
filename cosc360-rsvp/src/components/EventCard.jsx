import React from 'react';

const EventContainer = () => {
    return (
        <div className="event-container">
            <EventCard name="Concert" location="park" date="FEB 28 - 07:00 PM" />
            <EventCard name="art gallery show" location="art gallery" date="MAR 05 - 06:00 PM" />
            <EventCard />
        </div>
    )
}

export default EventContainer;

const EventCard = ({ name, location, date }) => {
    return (
        <div className="event-card">
            <img src="https://picsum.photos/300/160" alt="Event Image" />
            <div className="event-body">
                <h2>{name || "Default Name"}</h2>
                <p>{location || "Default Location"}</p>
                <p>{date || "Default Date"}</p>
            </div>
        </div>
    )
}

import React from 'react';
import './EventCard.css';
import EventCard from './EventCard.jsx';

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
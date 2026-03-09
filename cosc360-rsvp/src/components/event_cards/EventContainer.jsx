import React from 'react';
import '../../css/EventCard.css';
import EventCard from './EventCard.jsx';

const EventContainer = () => {
    return (
        <div className="event-container">
            <EventCard name="Concert" location="Central Park" date="FEB 28 - 07:00 PM" rating={4.5} />
            <EventCard name="Art Gallery Show" location="Downtown Art Gallery" date="MAR 05 - 06:00 PM" rating={3.8} />
            <EventCard name="Food Festival" location="Waterfront Plaza" date="MAR 12 - 12:00 PM" rating={4.2} />
        </div>
    )
}

export default EventContainer;
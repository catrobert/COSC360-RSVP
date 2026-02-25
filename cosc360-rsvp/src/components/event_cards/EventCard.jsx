import React from 'react';
import '../../css/EventCard.css';

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
export default EventCard;

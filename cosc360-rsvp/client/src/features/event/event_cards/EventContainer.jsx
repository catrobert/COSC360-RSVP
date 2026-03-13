import React from 'react';
import './EventCard.css';
import EventCard from './EventCard.jsx';

function averageRating(reviews) {
    if (reviews.length === 0 || !reviews) {
        return "N/A";
    }
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
        sum += reviews[i].rating;
    }
    return (sum / reviews.length);
}

const EventContainer = ( {events} ) => {
    return (
        <div className="event-container">
            {events.map((event) => (
                <EventCard key={event.id} 
                    name={event.name} 
                    location={event.location} 
                    date={ `${event.date} - ${event.startTime}` } 
                    rating={averageRating(event.reviews)}
                    price={event.price} />
            ))}
        </div>
    )
}

export default EventContainer;
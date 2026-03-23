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

const EventContainer = ({ events, onEventClick }) => {
  return (
    <div className="event-container">
      {events.map((event) => {
        const date = new Date(event.date).toLocaleDateString("en-US", {
          year:  "numeric",
          month: "short",
          day:   "numeric"
        }).toUpperCase();

        const time = new Date(`1970-01-01T${event.startTime}:00`).toLocaleTimeString("en-US", {
            hour:   "numeric",
            minute: "2-digit",
            hour12: true
        });



        return (
          <EventCard
            key={event._id}
            name={event.name}
            location={event.location}
            date={`${date} - ${time}`}
            rating={averageRating(event.reviews)}
            price={event.price}
            image={event.image}
            onClick={() => onEventClick(event._id.toString())}
          />
        );
      })}
    </div>
  );
};

export default EventContainer;
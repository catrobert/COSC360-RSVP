import React, { useEffect, useState } from 'react';
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

const EventContainer = ({ events, onEventClick, showReviewButton, onReviewClick, onEditClick }) => {
  const [savedEventIds, setSavedEventIds] = useState(new Set());

  useEffect(() => {
    // Load saved RSVP rows once so bookmarks render correctly on first paint.
    async function fetchSavedEvents() {
      const userId = localStorage.getItem("userId") || "000000000000000000000001";

      try {
        const response = await fetch("/api/rsvp/events?status=saved", {
          headers: {
            "x-user-id": userId,
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        // RSVP rows come back with populated eventId docs.
        const savedIds = new Set(
          (data.events || [])
            .map((item) => item?.eventId?._id?.toString?.() || item?.eventId?.toString?.())
            .filter(Boolean)
        );

        setSavedEventIds(savedIds);
      } catch (error) {
        console.log("Error fetching saved events:", error);
      }
    }

    fetchSavedEvents();
  }, []);

  // Keep a local set of saved ids in sync after each bookmark toggle.
  function handleWishlistChanged(eventId, isWishlisted) {
    setSavedEventIds((prev) => {
      const next = new Set(prev);

      if (isWishlisted) {
        next.add(eventId);
      } else {
        next.delete(eventId);
      }

      return next;
    });
  }

  return (
    <div className="event-container">
      {events.map((event) => {
        const eventId = event._id?.toString();
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
            eventId={eventId}
            initialWishlisted={savedEventIds.has(eventId)}
            onWishlistChanged={handleWishlistChanged}
            name={event.name}
            location={event.location}
            date={`${date} - ${time}`}
            rating={averageRating(event.reviews)}
            price={event.price}
            image={event.image}
            onClick={() => onEventClick?.(eventId)}
            showReviewButton={showReviewButton}
            onReviewClick={() => onReviewClick(event)}
            onEditClick={onEditClick ? () => onEditClick(event) : undefined}
          />
        );
      })}
    </div>
  );
};

export default EventContainer;
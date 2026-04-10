import { useEffect, useState } from 'react';
import './EventCard.css';
import EventCard from './EventCard.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';

function averageRating(reviews) {
  if (!reviews || reviews.length === 0) {
    return "N/A";
  }
  let sum = 0;
  for (let i = 0; i < reviews.length; i++) {
    sum += reviews[i].rating;
  }
  return (sum / reviews.length);
}

const EventContainer = ({ events, onEventClick, showReviewButton, onReviewClick, onEditClick, showDeleteRsvpButton, onDeleteRsvpClick, onSavedStateChange }) => {
  const [savedEventIds, setSavedEventIds] = useState(new Set());
  const { activeUserId } = useAuth();

  useEffect(() => {
    // Load saved RSVP rows once so bookmarks render correctly on first paint.
    async function fetchSavedEvents() {
      if (!activeUserId) {
        setSavedEventIds(new Set());
        return;
      }

      try {
        const response = await fetch("/api/rsvp/events?status=saved", {
          headers: {
            "x-user-id": activeUserId,
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
  }, [activeUserId]);

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
    onSavedStateChange?.(eventId, isWishlisted);
  }

  return (
    <div className="event-container">
      {events.map((event) => {
        const eventId = event?._id?.toString?.() || event?.id?.toString?.() || "";
        const date = new Date(event.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }).toUpperCase();

        const time = new Date(`1970-01-01T${event.startTime}:00`).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        });



        return (
          <EventCard
            key={eventId || event.name}
            eventId={eventId}
            initialWishlisted={savedEventIds.has(eventId)}
            onWishlistChanged={handleWishlistChanged}
            name={event.name}
            location={event.location}
            date={`${date} - ${time}`}
            rating={averageRating(event.reviews)}
            price={event.price}
            image={event.image}
            onClick={() => eventId && onEventClick?.(eventId)}
            showReviewButton={showReviewButton}
            onReviewClick={() => onReviewClick?.(event)}
            onEditClick={onEditClick ? () => onEditClick(event) : undefined}
            onDeleteRsvpClick={onDeleteRsvpClick}
            showDeleteRsvpButton={showDeleteRsvpButton}
          />
        );
      })}
    </div>
  );
};

export default EventContainer;
import React, { useEffect, useState } from 'react';
import { Bookmark, Star, MapPin, Calendar, DollarSign } from 'lucide-react';
import './EventCard.css';

const EventCard = ({ eventId, initialWishlisted = false, onWishlistChanged, name, location, date, rating, price, image, onClick, showReviewButton, onReviewClick }) => {
    const [wishlisted, setWishlisted] = useState(initialWishlisted);

    // Keep local button state in sync with data hydrated by the parent list.
    useEffect(() => {
        setWishlisted(initialWishlisted);
    }, [initialWishlisted]);

    async function handleWishlistClick(e) {
        e.stopPropagation();

        if (!eventId) return;

        const userId = localStorage.getItem("userId") || "000000000000000000000001";

        const nextWishlisted = !wishlisted;
        const nextStatus = nextWishlisted ? "saved" : "no";

        try {
            // Try to update an existing RSVP first.
            let response = await fetch(`/api/rsvp/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
                body: JSON.stringify({ status: nextStatus }),
            });

            // If no RSVP exists yet and user is saving, create it.
            if (response.status === 404 && nextWishlisted) {
                response = await fetch("/api/rsvp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": userId,
                    },
                    body: JSON.stringify({ eventId, status: "saved" }),
                });
            }

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                alert(result.error || "Could not update saved status.");
                return;
            }

            // Update local UI and notify parent so list state stays in sync.
            setWishlisted(nextWishlisted);
            onWishlistChanged?.(eventId, nextWishlisted);
        } catch (error) {
            console.log("Error updating saved status:", error);
        }
    }

    return (
        <div className="event-card" onClick={onClick}>
            <div className="event-card-image">
                <img src={image || "https://picsum.photos/300/160"} alt="Event Image" />
            </div>
            <div className="event-body">
                <div className="event-body-top">
                    <h2>{name || "Default Name"}</h2>
                    <div className="event-rating">
                        <Star size={14} fill="#f5c518" color="#f5c518" />
                        <span>{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
                    </div>
                </div>
                <div className="event-info">
                    <MapPin size={14} color="#888" />
                    <p>{location || "Default Location"}</p>
                </div>
                <div className="event-info">
                    <Calendar size={14} color="#888" />
                    <p>{date || "Default Date"}</p>
                </div>
                <div className="event-info">
                    <DollarSign size={14} color="#888" />
                    <p>${(Number(price) || 0).toFixed(2)} / ticket</p>
                </div>
                <button
                    className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
                    onClick={handleWishlistClick}
                >
                    <Bookmark size={22} fill={wishlisted ? 'gold' : 'none'} color={wishlisted ? 'gold' : '#888'} />
                </button>

                {showReviewButton && <button className="review-btn" onClick={onReviewClick}>Leave a Review</button>}
            </div>
        </div>
    )
}
export default EventCard;

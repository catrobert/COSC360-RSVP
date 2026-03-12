import React, { useState } from 'react';
import { Bookmark, Star, MapPin, Calendar, DollarSign } from 'lucide-react';
import './EventCard.css';

const EventCard = ({ name, location, date, rating = 4.0, price = 0 }) => {
    const [wishlisted, setWishlisted] = useState(false);

    return (
        <div className="event-card">
            <div className="event-card-image">
                <img src="https://picsum.photos/300/160" alt="Event Image" />
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
                    <p>${typeof price === 'number' ? price.toFixed(2) : '0.00'}</p>
                </div>
                <button
                    className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
                    onClick={() => setWishlisted(!wishlisted)}
                >
                    <Bookmark size={22} fill={wishlisted ? 'gold' : 'none'} color={wishlisted ? 'gold' : '#888'} />
                </button>
            </div>
        </div>
    )
}
export default EventCard;

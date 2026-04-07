import '../../../css/Event.css';
import { Calendar, MapPin, Clock, Users, Handshake } from 'lucide-react';

function EventDetails({ event }) {
    const date = new Date(event.date).toLocaleDateString("en-US", {
        year:  "numeric",
        month: "short",
        day:   "numeric"
    }).toUpperCase();

    const start = new Date(`1970-01-01T${event.startTime}:00`).toLocaleTimeString("en-US", {
        hour:   "numeric",
        minute: "2-digit",
        hour12: true
    });

    const end = new Date(`1970-01-01T${event.endTime}:00`).toLocaleTimeString("en-US", {
        hour:   "numeric",
        minute: "2-digit",
        hour12: true
    });

    return (
        <div className="event-details">
            <p className="event-detail"><Calendar className="detail-icon" /> {date}</p>
            <p className="event-detail"><MapPin className="detail-icon" /> {event.location}</p>
            <p className="event-detail"><Clock className="detail-icon" /> {start} - {end}</p>
            <p className="event-detail"><Users className="detail-icon" /> {event.attendance ?? 0} people going</p>
            <p className="event-detail"><Handshake className='detail-icon' />Host: {event.createdBy?.username ?? "Group 360"}</p>
        </div>
    );
}

export default EventDetails;
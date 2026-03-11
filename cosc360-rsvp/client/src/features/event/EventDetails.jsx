import "../../css/Event.css";
import { Calendar, MapPin, Clock, Users, UserPlus } from 'lucide-react';
    

function EventDetails({ event }) {
    return (
        <div className="event-details">
            <p className="event-detail"><Calendar className="detail-icon" /> {event.date}</p>
            <p className="event-detail"><MapPin className="detail-icon" /> {event.location}</p>
            <p className="event-detail"><Clock className="detail-icon" /> {event.time}</p>
            <p className="event-detail"><Users className="detail-icon" /> {event.attendees}</p>
            <p className="event-detail"><UserPlus className="detail-icon" /> {event.host}</p>
        </div>
    );
}

export default EventDetails;
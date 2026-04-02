import '../../../css/Event.css';
import EventDetails from './EventDetails';


function SingleEventContainer({ event, onRsvpClick, onEditClick, onDeleteClick }) {
    return (
        <div id="event-container">
            <img id="event-image" src={event.image || "https://picsum.photos/800/400"} alt={event.name} /> 
            <div id="event-info">
                <div id="event-details"><EventDetails event={event} /></div>
                <p id="event-description">{event.description}</p>
            </div>
            <div className="rsvp-section">
                <button id="rsvp-button" onClick={onRsvpClick}>RSVP</button>
                <span>${(Number(event.price) || 0).toFixed(2)} / ticket</span>
            </div>
            {(onEditClick || onDeleteClick) && (
                <div className="event-owner-actions">
                    {onEditClick && <button className="event-edit-btn" onClick={onEditClick}>Edit Event</button>}
                    {onDeleteClick && <button className="event-delete-btn" onClick={onDeleteClick}>Delete Event</button>}
                </div>
            )}
        </div>
    );
}

export default SingleEventContainer;
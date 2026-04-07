import '../../../css/Event.css';
import EventDetails from './EventDetails';


function SingleEventContainer({ event, ableToRsvp, onRsvpClick }) {
    return (
        <div id="event-container">
            <img id="event-image" src={event.image || "https://picsum.photos/800/400"} alt={event.name} /> 
            <div id="event-info">
                <div id="event-details"><EventDetails event={event} /></div>
                <p id="event-description">{event.description}</p>
            </div>
            <div className="rsvp-section">
                <button id={ableToRsvp ? "rsvp-button" : "greyed-rsvp-btn"} onClick={onRsvpClick}>RSVP</button>
                <span>${(Number(event.price) || 0).toFixed(2)} / ticket</span>
            </div>
        </div>
    );
}

export default SingleEventContainer;
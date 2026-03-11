import '../../css/Event.css'
import EventDetails from './EventDetails';


function EventContainer({ event }) {
    return (
        <div id="event-container">
            <img id="event-image" src={event.image} alt={event.title} />
            <div id="event-info">
                <div id="event-details"><EventDetails event={event} /></div>
                <p id="event-description">{event.description}</p>
            </div>
            <div className="rsvp-section">
                <button id="rsvp-button">RSVP</button>
                <span>{event.price}</span>
            </div>
            

        </div>
    );
}

export default EventContainer;
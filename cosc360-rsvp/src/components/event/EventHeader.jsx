export default function EventHeader({ event }) {
    return (
        <div className="event-header">
            <div className="search-section">
                <div className="search-bar">
                    <input type="text" placeholder="Search events..." />
                    <button>Search</button>
                </div>
                <button className="create-event-btn">Create Event</button>
            </div>
            <h1 id="event-title">{event.title}</h1>
        </div>
    
    );
}
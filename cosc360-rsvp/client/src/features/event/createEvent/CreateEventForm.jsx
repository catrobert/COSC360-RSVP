import '../../../css/CreateEventForm.css';

function CreateEventForm({ onClose }) {

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach((field) => {
            const existingError = field.parentNode.querySelector('.ce-error');
            if (existingError) {
                existingError.remove();
            }

            if (field.value === '') {
                isValid = false;
                field.style.border = '2px solid red';
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'ce-error';
                errorDiv.textContent = 'This field is required';
                field.parentNode.appendChild(errorDiv);
            } else {
                field.style.border = '';
            }
        });

        if (isValid) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            const response = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            alert(result.message);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Create Event</h2>

                <form
                    id="create-event-form"
                    method="post"
                    onSubmit={handleSubmit}
                    noValidate>

                    <div className="ce-form-group">
                        <label>Event Name</label>
                        <input
                            type="text"
                            id="ce-name"
                            name="name"
                            placeholder="Your event name..."
                            required
                        />
                    </div>

                    <div className="ce-form-group">
                        <label>Event Location</label>
                        <input
                            type="text"
                            id="ce-location"
                            name="location"
                            placeholder="Your event location..."
                            required
                        />
                    </div>

                    <div className="ce-form-group">
                        <label>Event Date</label>
                        <input
                            type="date"
                            id="ce-date"
                            name="date"
                            required
                        />
                    </div>

                    <div className="ce-form-row">
                        <div className="ce-form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                id="ce-startTime"
                                name="startTime"
                                required
                            />
                        </div>
                        <div className="ce-form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                id="ce-endTime"
                                name="endTime"
                                required
                            />
                        </div>
                    </div>

                    <div className="ce-form-group">
                        <label>Description</label>
                        <textarea
                            id="ce-description"
                            name="description"
                            placeholder="Event description..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="ce-form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            id="ce-price"
                            name="price"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="ce-form-actions">
                        <button type="button" className="ce-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ce-submit-btn">Create Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateEventForm;

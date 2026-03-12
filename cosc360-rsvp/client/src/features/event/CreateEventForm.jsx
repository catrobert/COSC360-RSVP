import { useRef } from 'react';
import './CreateEventForm.css';

function CreateEventForm({ onClose }) {
    const formRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = formRef.current;
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach((field) => {
            // get rid of prv err
            field.classList.remove('ce-input-error');
            const existingError = field.parentNode.querySelector('.ce-error');
            if (existingError) existingError.remove();

            // if field empty add error
            if (field.value === '') {
                isValid = false;
                field.classList.add('ce-input-error');

                const errorDiv = document.createElement('div');
                errorDiv.classList.add('ce-error');
                errorDiv.textContent = 'This field is required';
                field.parentNode.insertBefore(errorDiv, field.nextSibling);
            }
        });

        if (isValid) {
            //no db yet so cant send
            const formData = new FormData(form);
            console.log('Event created:', Object.fromEntries(formData));
            alert('Event created successfully!');
            onClose();
        }
    };

    const handleInput = (e) => {
        const field = e.target;
        field.classList.remove('ce-input-error');
        const existingError = field.parentNode.querySelector('.ce-error');
        if (existingError) existingError.remove();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Create Event</h2>

                <form
                    id="create-event-form"
                    ref={formRef}
                    method="post"
                    onSubmit={handleSubmit}
                    noValidate>

                    <div className="ce-form-group">
                        <label htmlFor="ce-name">Event Name</label>
                        <input
                            type="text"
                            id="ce-name"
                            name="name"
                            placeholder="Your event name..."
                            required
                            onInput={handleInput}
                        />
                    </div>

                    <div className="ce-form-group">
                        <label htmlFor="ce-location">Event Location</label>
                        <input
                            type="text"
                            id="ce-location"
                            name="location"
                            placeholder="Your event location..."
                            required
                            onInput={handleInput}
                        />
                    </div>

                    <div className="ce-form-group">
                        <label htmlFor="ce-date">Event Date</label>
                        <input
                            type="date"
                            id="ce-date"
                            name="date"
                            required
                            onInput={handleInput}
                        />
                    </div>

                    <div className="ce-form-row">
                        <div className="ce-form-group">
                            <label htmlFor="ce-startTime">Start Time</label>
                            <input
                                type="time"
                                id="ce-startTime"
                                name="startTime"
                                required
                                onInput={handleInput}
                            />
                        </div>
                        <div className="ce-form-group">
                            <label htmlFor="ce-endTime">End Time</label>
                            <input
                                type="time"
                                id="ce-endTime"
                                name="endTime"
                                required
                                onInput={handleInput}
                            />
                        </div>
                    </div>

                    <div className="ce-form-group">
                        <label htmlFor="ce-description">Description</label>
                        <textarea
                            id="ce-description"
                            name="description"
                            placeholder="Event description..."
                            rows="4"
                            required
                            onInput={handleInput}
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

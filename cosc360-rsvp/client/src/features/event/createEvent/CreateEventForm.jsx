import '../../../css/CreateEventForm.css';
import { useAuth } from "../../../context/AuthContext.jsx";

function CreateEventForm({ onClose }) {
    const { user } = useAuth();

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

            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "x-user-id": user._id || user.id,
                },
                body: formData,
            });

            const result = await response.json();
            if (result.error) {
                alert(result.error);
            } else {
                alert(result.message);
                onClose();
            }
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
                    noValidate
                    className="ce-form-grid">

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
                            min="2020-01-01"
                            max="2099-12-31"
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

                    <div className="ce-form-group ce-form-full">
                        <label>Event Image</label>
                        <input
                            type="file"
                            id="ce-image"
                            name="image"
                            accept="image/*"
                        />
                    </div>

                    <div className="ce-form-group ce-form-full">
                        <label>Description</label>
                        <textarea
                            id="ce-description"
                            name="description"
                            placeholder="Event description..."
                            rows="3"
                            required
                        />
                    </div>

                    <div className="ce-form-actions ce-form-full">
                        <button type="button" className="ce-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ce-submit-btn">Create Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateEventForm;

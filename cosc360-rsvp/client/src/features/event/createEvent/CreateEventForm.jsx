import '../../../css/CreateEventForm.css';
import { useAuth } from "../../../context/AuthContext.jsx";

function CreateEventForm({ onClose, initialData = null, eventId = null }) {
    const { user } = useAuth();
    const isEditing = !!eventId;

    const defaultDate = initialData?.date
        ? new Date(initialData.date).toISOString().split("T")[0]
        : "";

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

            const url = isEditing ? `/api/events/${eventId}` : "/api/events";
            const method = isEditing ? "PUT" : "POST";

            try {
                const response = await fetch(url, {
                    method,
                    headers: { "x-user-id": user._id || user.id },
                    body: formData,
                });

                const result = await response.json();
                if (result.error) {
                    alert(result.error);
                } else {
                    alert(result.message);
                    onClose(result.event);
                }
            } catch (error) {
                console.log("Error submitting event form:", error);
                alert("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={() => onClose()}>
            <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
                <h2>{isEditing ? "Edit Event" : "Create Event"}</h2>

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
                            defaultValue={initialData?.name || ""}
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
                            defaultValue={initialData?.location || ""}
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
                            defaultValue={defaultDate}
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
                            defaultValue={initialData?.price ?? ""}
                            required
                        />
                    </div>

                    <div className="ce-form-group">
                        <label>Start Time</label>
                        <input
                            type="time"
                            id="ce-startTime"
                            name="startTime"
                            defaultValue={initialData?.startTime || ""}
                            required
                        />
                    </div>

                    <div className="ce-form-group">
                        <label>End Time</label>
                        <input
                            type="time"
                            id="ce-endTime"
                            name="endTime"
                            defaultValue={initialData?.endTime || ""}
                            required
                        />
                    </div>

                    <div className="ce-form-group ce-form-full">
                        <label>Event Image {isEditing && <span style={{ fontWeight: 400, color: "#888" }}>(leave blank to keep existing)</span>}</label>
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
                            defaultValue={initialData?.description || ""}
                            required
                        />
                    </div>

                    <div className="ce-form-actions ce-form-full">
                        <button type="button" className="ce-cancel-btn" onClick={() => onClose()}>Cancel</button>
                        <button type="submit" className="ce-submit-btn">{isEditing ? "Save Changes" : "Create Event"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateEventForm;

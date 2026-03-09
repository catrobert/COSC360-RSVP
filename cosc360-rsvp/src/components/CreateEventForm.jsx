import { useState } from 'react';
import '../css/CreateEventForm.css';

function CreateEventForm({ onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        date: '',
        startTime: '',
        endTime: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    // Clear error when user types
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Validate on submit, preventDefault if invalid
    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        for (const [key, value] of Object.entries(formData)) {
            if (value.trim() === '') {
                newErrors[key] = 'This field is required';
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // Would send to server when we have a DB
        console.log('Event created:', formData);
        alert('Event created successfully!');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Create Event</h2>
                <form onSubmit={handleSubmit} noValidate>

                    <div className="ce-form-group">
                        <label htmlFor="ce-name">Event Name</label>
                        <input
                            type="text"
                            id="ce-name"
                            name="name"
                            placeholder="Your event name..."
                            className={errors.name ? 'ce-input-error' : ''}
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <span className="ce-error">{errors.name}</span>}
                    </div>

                    <div className="ce-form-group">
                        <label htmlFor="ce-location">Event Location</label>
                        <input
                            type="text"
                            id="ce-location"
                            name="location"
                            placeholder="Your event location..."
                            className={errors.location ? 'ce-input-error' : ''}
                            value={formData.location}
                            onChange={handleChange}
                        />
                        {errors.location && <span className="ce-error">{errors.location}</span>}
                    </div>

                    <div className="ce-form-group">
                        <label htmlFor="ce-date">Event Date</label>
                        <input
                            type="date"
                            id="ce-date"
                            name="date"
                            className={errors.date ? 'ce-input-error' : ''}
                            value={formData.date}
                            onChange={handleChange}
                        />
                        {errors.date && <span className="ce-error">{errors.date}</span>}
                    </div>

                    <div className="ce-form-row">
                        <div className="ce-form-group">
                            <label htmlFor="ce-startTime">Start Time</label>
                            <input
                                type="time"
                                id="ce-startTime"
                                name="startTime"
                                className={errors.startTime ? 'ce-input-error' : ''}
                                value={formData.startTime}
                                onChange={handleChange}
                            />
                            {errors.startTime && <span className="ce-error">{errors.startTime}</span>}
                        </div>
                        <div className="ce-form-group">
                            <label htmlFor="ce-endTime">End Time</label>
                            <input
                                type="time"
                                id="ce-endTime"
                                name="endTime"
                                className={errors.endTime ? 'ce-input-error' : ''}
                                value={formData.endTime}
                                onChange={handleChange}
                            />
                            {errors.endTime && <span className="ce-error">{errors.endTime}</span>}
                        </div>
                    </div>

                    <div className="ce-form-group">
                        <label htmlFor="ce-description">Description</label>
                        <textarea
                            id="ce-description"
                            name="description"
                            placeholder="Event description..."
                            rows="4"
                            className={errors.description ? 'ce-input-error' : ''}
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <span className="ce-error">{errors.description}</span>}
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

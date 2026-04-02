import "../../../css/reviewModal.css";
import { useAuth } from "../../../context/AuthContext.jsx";

function ReviewModal({ event, onClose }) {
    const { user } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach( (field) => {
            const existingError = field.parentNode.querySelector('.review-error');
            if (existingError) {
                existingError.remove();
            }

            if (field.value === '') {
                isValid = false;
                field.style.border = '2px solid red';

                const errorDiv = document.createElement('div');
                errorDiv.className = 'review-error';
                errorDiv.textContent = 'This field is required';
                field.parentNode.appendChild(errorDiv);
            } else if (field.value < 1 || field.value > 5) {
                isValid = false;
                field.style.border = '2px solid red';

                const errorDiv = document.createElement('div');
                errorDiv.className = 'review-error';
                errorDiv.textContent = 'Please input a number between 1 and 5';
                field.parentNode.appendChild(errorDiv);
            } else {
                field.style.border = '';
            }
        });

        if (isValid) {
            try {
             const response = await fetch(`/api/events/review/${event._id}`, {   
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": user._id || user.id,
                    },
                    body: JSON.stringify({
                        rating: Number(form.rating.value),
                        comment: form.comment.value
                    }),
                });

                const result = await response.json();

                if (result.error) {
                    alert(`Something went wrong: ${result.error}`);
                    return;
                }
                
                alert("Review posted successfully!"); 
                onClose();  
            } catch (error) {
                console.log("Error posting review: ", error);
            }
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()} >
                <h2>Leave a Review</h2>

                <form
                    id="review-event-form"
                    method="post"
                    onSubmit={handleSubmit}
                    noValidate
                    className="review-form-grid">
                    
                    <div className="review-form-group">
                        <label>Rating (1-5)</label>
                        <input type="number" id="rating" min="1" max="5" required />
                    </div>

                    <div className="review-form-group">
                        <label>Comment</label>
                        <textarea type="text" 
                        id="comment"
                        placeholder="Share details of your experience at this event" rows="3" required/>
                    </div>

                    <div className="review-form-actions review-form-full">
                        <button type="button" className="review-cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="review-submit-btn">Post Review</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ReviewModal;
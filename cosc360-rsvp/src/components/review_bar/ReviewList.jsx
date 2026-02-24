import ReviewItem from './ReviewItem.jsx';
import './Review.css';

export function ReviewList({ reviews }) {
    return (
        <div>
            <ul className="reviews-list"> 
                {reviews.map((review, index) => (
                    <ReviewItem key={index} review={review} rating={"⭐".repeat(review.rating)} />
                ))}
            </ul>
            <button className="add-review-button">Add Review</button>
        </div>
        
    );
}
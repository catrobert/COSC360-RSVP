import '../Event.css';
import ReviewItem from './ReviewItem.jsx';

function getAverageRating(reviews) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
}

function ReviewsCard( { reviews } ) {
    const averageRating = getAverageRating(reviews);
    return (
        <div className="reviews-container">
            <header className="reviews-header">
                <h3 className="reviews-title">Reviews</h3>
                <h1 className="overall-number-rating">{averageRating.toFixed(1)}</h1>
                <div className="stars">
                    {"⭐".repeat(Math.round(averageRating))}
                </div>
            </header>
            <div className="review-list-container">
                {reviews.map((review, index) => (
                    <ReviewItem key={index} review={review} rating={"⭐".repeat(review.rating)} reviewerName={review.reviewerName} />
                ))}
                <button className="add-review-button">Add Review</button>
            </div>
        </div>
    );
}

export default ReviewsCard;
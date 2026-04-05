import '../../../css/Event.css';


function getAverageRating(reviews) {
    if (!Array.isArray(reviews) || reviews.length === 0) {
        return null;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
}

function ReviewsCard({ reviews, onReviewClick, ableToReview }) {
    return (
        <aside className="reviews-container">
            <div className='reviews-background'>
                <Header reviews={reviews} />
                <ReviewList reviews={reviews} onReviewClick={onReviewClick} canReview={ableToReview} />

            </div>
        </aside>
    );
}

function Header({ reviews }) {
    const avg = getAverageRating(reviews);
    return (
        <header className="reviews-header">
            <h3 className="reviews-title">Reviews</h3>
            {avg ? <h1 className="overall-number-rating">{avg.toFixed(1)}</h1> : <p className="no-reviews">No Reviews Yet</p>}
            <div className="stars">
                {avg ? "⭐".repeat(Math.round(avg)) : ""}
            </div>
        </header>
    );
}

function ReviewList({ reviews, onReviewClick, canReview }) {
    const safeReviews = Array.isArray(reviews) ? reviews : [];

    return (
        <div>
            <ul className="reviews-list-container">
                {safeReviews.map((review, index) => (
                    <ReviewItem key={index} index={index} review={review} />
                ))}
            </ul>
            <button className={canReview ? "add-review-button" : "greyed-out-review-btn"} onClick={onReviewClick}>Add Review</button>
        </div>

    );
}


function ReviewItem({ review, index }) {
    return (
        <>
            <div className="review-title">
                <div>{review.userId?.username ?? `Reviewer ${index + 1}`}</div> {/* TODO: switch this use userId to join username in user table and display that */}
                <div>{"⭐".repeat(review.rating)}</div>
            </div>
            <p className="review-text">{review.comment}</p>
        </>
    );
}


export default ReviewsCard;
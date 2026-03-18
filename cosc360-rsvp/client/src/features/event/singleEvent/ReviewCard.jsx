import '../../../css/Event.css';


function getAverageRating(reviews) {
    if (reviews.length === 0) {
        return null;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
}

function ReviewsCard({reviews}) {
    return (
        <aside className="sidebar">
            <Header reviews={reviews} />
            <ReviewList reviews={reviews} />
        </aside>
    );
}

function Header({reviews}) {
    const avg = getAverageRating(reviews);
    return (
        <header className="reviews-header">
            <h3 className="reviews-title">Reviews</h3>
            <h1 className="overall-number-rating">{avg ? avg.toFixed(1) : "No Reviews Yet"}</h1>
            <div className="stars">
                {avg ? "⭐".repeat(Math.round(avg)) : ""}
            </div>
        </header>
    );
}

function ReviewList({ reviews }) {
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

function ReviewItem({ review }) {
    return (
        <li className="review-item">{review.comment} <span className="rating">{review.rating}</span></li>
    );
}

export default ReviewsCard;
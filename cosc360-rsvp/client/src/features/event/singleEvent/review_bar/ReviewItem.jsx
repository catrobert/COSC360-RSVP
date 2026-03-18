export default function ReviewItem({ review, rating, reviewerName }) {
    return (
        <div className="review-item">
            <div className="review-title">
                <div className="reviewer-name">{reviewerName}</div>
                <div className="review-stars">{rating}</div>
            </div>
            <p className="review-text">{review.text}</p>
        </div>
    );
}
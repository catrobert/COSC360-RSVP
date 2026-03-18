import React from 'react';
import '..css/Review.css';


function getAverageRating() {
    if (reviews.length === 0) {
        return null;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
}

function ReviewsCard() {
    return (
        <aside className="sidebar">
            <Header />
            <ReviewList reviews={reviews} />
        </aside>
    );
}

function Header() {
    return (
        <header className="reviews-header">
            <h3 className="reviews-title">Reviews</h3>
            <h1 className="overall-number-rating">{getAverageRating() !== null ? getAverageRating().toFixed(1) : "No Reviews Yet"}</h1>
            <div className="stars">
                {getAverageRating() !== null ? "⭐".repeat(Math.round(getAverageRating())) : "0"}
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

function ReviewItem({ review, rating }) {
    return (
        <li className="review-item">{review.comment} <span className="rating">{rating}</span></li>
    );
}

export default ReviewsCard;
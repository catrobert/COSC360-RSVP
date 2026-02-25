import React from 'react';
import '..css/Review.css';

const reviews = [
    { id: 1, text: "Great event!", rating: 5 },
    { id: 2, text: "Had a wonderful time.", rating: 4 },
    { id: 3, text: "Would attend again.", rating: 4 },
    { id: 4, text: "Not what I expected.", rating: 2 },
    { id: 5, text: "Amazing experience!", rating: 5 }
];

function getAverageRating() {
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
            <h1 className="overall-number-rating">{getAverageRating().toFixed(1)}</h1>
            <div className="stars">
                {"⭐".repeat(Math.round(getAverageRating()))}
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
        <li className="review-item">{review.text} <span className="rating">{rating}</span></li>
    );
}

export default ReviewsCard;
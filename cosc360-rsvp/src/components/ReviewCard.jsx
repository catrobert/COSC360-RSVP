import React from 'react';
import '../Review.css';

function ReviewsCard() {
    return (
        <aside class="sidebar">
            <Header />
            <ReviewList reviews={["Great event!", "Had a wonderful time.", "Would attend again."]} />
        </aside>
    );
}

function Header() {
    return (
        <header>
            <h3>Reviews</h3>
            <h1>5.0</h1>
            <div class="rating">
                <span class="star">⭐</span>
                <span class="star">⭐</span>
                <span class="star">⭐</span>
                <span class="star">⭐</span>
                <span class="star">⭐</span>
            </div>
            <hr />
        </header>
    );
}

function ReviewList({ reviews }) {
    return (
        <ul>
            {reviews.map((review, index) => (
                <ReviewItem key={index} review={review} rating={"⭐".repeat(Math.floor(Math.random() * 5) + 1)} />
            ))}
        </ul>
    );
}

function ReviewItem({ review, rating }) {
    return (
        <li>{review} <span class="rating">{rating}</span></li>
    );
}

export default ReviewsCard;
import '../../css/EventCard.css';
import ReviewHeader from './ReviewHeader.jsx';
import ReviewList from './ReviewList.jsx';

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
            <ReviewHeader averageRating={getAverageRating()} />
            <ReviewList reviews={reviews} />
        </aside>
    );
}

export default ReviewsCard;
import '../../css/EventCard.css';

export default function ReviewItem({ review, rating }) {
    return (
        <li className="review-item">{review.text} <span className="rating">{rating}</span></li>
    );
}
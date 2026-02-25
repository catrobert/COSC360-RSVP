import '../../css/EventCard.css';

export default function ReviewHeader({ averageRating }) {
    return (
        <header className="reviews-header">
            <h3 className="reviews-title">Reviews</h3>
            <h1 className="overall-number-rating">{averageRating.toFixed(1)}</h1>
            <div className="stars">
                {"⭐".repeat(Math.round(averageRating))}
            </div>
        </header>
    );
}
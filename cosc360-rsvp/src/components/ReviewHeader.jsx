
export function Header() {
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
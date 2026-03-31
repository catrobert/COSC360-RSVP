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
        <aside className="reviews-container">
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
            { avg ? <h1 className="overall-number-rating">{avg.toFixed(1)}</h1> : <p className="no-reviews">No Reviews Yet</p>}
            <div className="stars">
                {avg ? "⭐".repeat(Math.round(avg)) : ""}
            </div>
        </header>
    );
}

function ReviewList({ reviews }) {
    return (
        <div>
            <ul className="reviews-list-container"> 
                {reviews.map((review, index) => (
                    <ReviewItem key={index} index={index} review={review} rating={"⭐".repeat(review.rating)} />
                ))}
            </ul>
            <button className="add-review-button">Add Review</button>
        </div>
        
    );
}


function ReviewItem({review, index }) {
    return (
        <>
            <div className="review-title">
                <div>{review.userId?.username ?? `Reviewer ${index + 1}`}</div> {/* TODO: switch this use userId to join username in user table and display that */}
                <div>{review.rating}</div>
            </div>
            <p className="review-text">{review.comment}</p>
        </>
    );
}
 

export default ReviewsCard;
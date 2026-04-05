import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, required: true },
        comment: { type: String }
    }
)

const eventSchema = new Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        attendance: { type: Number, default: 0 },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        image: { type: String },
        reviews: [reviewSchema],

    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

eventSchema.virtual("averageRating").get(function () {
    if (!this.reviews || this.reviews.length === 0) {
        return null;
    }

    const total = this.reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0);
    return total / this.reviews.length;
});

export const EventModel = mongoose.model("Event", eventSchema);
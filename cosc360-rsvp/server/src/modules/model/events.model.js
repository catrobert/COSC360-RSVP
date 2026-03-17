import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema (
    {
        username: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String }
    }
)

const eventSchema = new Schema (
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        attendance: { type: Number, default: 0 },
        host: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        reviews: [reviewSchema],

    }
);

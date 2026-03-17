import mongoose, { Schema } from "mongoose";

const rsvpSchema = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, required: true }, // 'yes', 'no', 'saved'
    }
);

export const RSVPModel = mongoose.model("RSVP", rsvpSchema);
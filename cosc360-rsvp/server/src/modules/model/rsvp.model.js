import mongoose, { Schema } from "mongoose";

const rsvpSchema = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["yes", "no", "saved"], required: true },
    }
);

rsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const RSVPModel = mongoose.model("RSVP", rsvpSchema);
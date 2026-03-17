import mongoose, { Schema } from "mongoose";

const descriptionSchema = new Schema(
    {
        birthday: { type: Date, required: true },
        gender: { type: String, enum: ["Male", "Female", "Other", "Prefer Not To Say"], required: true},
        location: { type: String, required: true }
    }
)

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        createdDate: { type: Date, required: true },
        description: [descriptionSchema],
        role: { type: String, enum: ["user", "admin"], default: "user", required: true },
        adminCreatedDate: { type: Date }
    }
)

export const UserSchema = mongoose.model("User", userSchema);
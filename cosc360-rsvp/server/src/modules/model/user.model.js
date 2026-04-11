import mongoose, { Schema } from "mongoose";

const descriptionSchema = new Schema(
    {
        birthday: { type: Date, required: true },
        gender: { type: String, enum: ["Male", "Female", "Other", "Prefer Not To Say"], required: true },
        location: { type: String, required: true }
    }
)

const userSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        createdDate: { type: Date, required: true },
        description: [descriptionSchema],
        role: { type: String, enum: ["user", "admin"], default: "user", required: true },
        isActivated: { type: Boolean, required: true, default: true },
        adminCreatedDate: { type: Date },
        profilePhoto: { type: String }
    }
)

export const UserSchema = mongoose.model("User", userSchema);
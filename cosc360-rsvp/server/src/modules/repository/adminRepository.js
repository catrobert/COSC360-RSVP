import { UserSchema } from "../model/user.model.js";

export async function getAllUsers() {
    return UserSchema.find();
}
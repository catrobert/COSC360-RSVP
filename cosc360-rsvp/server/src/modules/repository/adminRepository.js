import { UserSchema } from "../model/user.model.js";
import { EventModel } from "../model/event.model.js";
import { RSVPModel } from "../model/rsvp.model.js";

export async function getAllUsers() {
    return UserSchema.find();
}
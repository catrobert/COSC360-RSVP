import { RSVPModel } from "../model/rsvp.model.js";

export async function createRSVP(rsvpData) {
    const rsvp = await RSVPModel.create(rsvpData);
    return rsvp.toJSON();
}

export async function findRSVP(eventId, userId) {
    return await RSVPModel.findOne(
        {
            eventId: eventId,
            userId: userId
        }
    )
}
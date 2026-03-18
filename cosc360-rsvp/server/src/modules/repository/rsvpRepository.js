import { RSVPModel } from "../model/rsvp.model.js";

export async function createRSVP(rsvpData) {
    const rsvp = await RSVPModel.create(rsvpData);
    return rsvp.toJSON();
}
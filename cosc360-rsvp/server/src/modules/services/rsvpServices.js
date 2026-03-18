import * as rsvpRepository from "../repository/rsvpRepository.js";

export async function createRSVP(rsvpData) {
    const existingRSVP = await rsvpRepository.findRSVP(rsvpData);

    if (existingRSVP) {
        throw new Error("You have already RSVP'd to this event!");
    }

    return await rsvpRepository.createRSVP(rsvpData);
}
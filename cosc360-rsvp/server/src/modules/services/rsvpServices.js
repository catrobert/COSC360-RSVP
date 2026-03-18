import * as rsvpRepository from "../repository/rsvpRepository.js";

export async function createRSVP(rsvpData) {
    return await rsvpRepository.createRSVP(rsvpData);
}
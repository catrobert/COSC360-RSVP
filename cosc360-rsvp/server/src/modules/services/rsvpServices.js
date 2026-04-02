import * as rsvpRepository from "../repository/rsvpRepository.js";

const VALID_STATUSES = new Set(["yes", "no", "saved"]);

function validateStatus(status) {
    if (!status) {
        throw new Error("RSVP status is required");
    }

    if (!VALID_STATUSES.has(status)) {
        throw new Error("Invalid RSVP status");
    }
}

export async function createRSVP(rsvp, userId) {
    validateStatus(rsvp.status);

    const rsvpData = {
        eventId: rsvp.eventId,
        userId: userId,
        status: rsvp.status,
    }

    const existingRSVP = await rsvpRepository.findRSVP(rsvpData.eventId, rsvpData.userId);

    if (existingRSVP) {
        throw new Error("You have already RSVP'd to this event!");
    }

    return await rsvpRepository.createRSVP(rsvpData);
}

export async function updateRSVP(rsvpData) {
    validateStatus(rsvpData.status);

    return await rsvpRepository.updateRSVP(rsvpData.eventId, rsvpData.userId, rsvpData.status);
}

export async function getRSVPsByStatus(userId, status, query) {
    validateStatus(status);

    return await rsvpRepository.findEventsByStatus(userId, status, query);
}

export async function getRSVPstatus(userId, eventId) {
    return await rsvpRepository.getRSVPstatus(userId, eventId);
}
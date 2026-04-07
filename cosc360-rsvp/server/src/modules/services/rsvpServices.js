import * as rsvpRepository from "../repository/rsvpRepository.js";
import { updateEventAttendance } from "../repository/eventRepository.js";

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

    if (existingRSVP?.status === 'yes') {
        throw new Error("You have already RSVP'd to this event!");
    }

    await updateEventAttendance(rsvp.eventId, 1)

    if (existingRSVP?.status === 'no' || existingRSVP?.status === 'saved') {
        return await updateRSVP(rsvpData);
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

export async function declineRSVP(userId, eventId) {
    const hasRSVP = await rsvpRepository.findRSVP(eventId, userId);

    if (!hasRSVP) {
        throw new Error("You have not RSVP'd to this event, so there is no RSVP to cancel");
    }

    if (hasRSVP?.status !== 'yes') {
        throw new Error("You have not RSVP'd 'yes' to this event, so there is no RSVP to cancel")
    }

    await updateEventAttendance(eventId, -1)
    return await rsvpRepository.declineRSVP(userId, eventId);
}
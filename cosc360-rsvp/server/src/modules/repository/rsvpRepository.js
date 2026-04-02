import { RSVPModel } from "../model/rsvp.model.js";

export async function createRSVP(rsvpData) {
    const rsvp = await RSVPModel.create(rsvpData);
    return rsvp.toJSON();
}

export async function updateRSVP(eventId, userId, status) {
    const rsvp = await RSVPModel.findOneAndUpdate({eventId, userId}, { status }, { new: true, runValidators: true });

    if (!rsvp) {
        throw new Error("RSVP not found");
    }

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

export async function getRSVPstatus(userId, eventId) {
    return await RSVPModel.find( {userId: userId, eventId: eventId} );  
}

export async function findEventsByStatus(userId, status, query) {
    const eventMatch = query?.trim()
        ? { name: { $regex: query.trim(), $options: "i" } }
        : undefined;

    const rows = await RSVPModel.find({
        userId: userId,
        status: status,
    }).populate({ path: "eventId", match: eventMatch });

    if (!eventMatch) {
        return rows;
    }

    // When populate match fails, eventId is null, remove those rows.
    return rows.filter((row) => row?.eventId);
}
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

export async function findEventsByStatus(userId, status) {
    return await RSVPModel.find(
        {
            userId: userId,
            status: status
        }
    ).populate("eventId");
}

export async function getRSVPstatus(userId, eventId) {
    return await EventModel.find( {userId: userId, eventId: eventId} );
}
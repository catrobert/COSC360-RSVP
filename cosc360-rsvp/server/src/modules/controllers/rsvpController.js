import * as rsvpService from "../services/rsvpServices.js";

export const createRSVP = async (req, res) => {
    const userId = req.userId;

    try {
        const newRsvp = await rsvpService.createRSVP({ ...req.body}, userId);
        res.status(201).json({ message: "RSVP created successfully!", event: newRsvp });
    } catch (error) {
        if (error.message === "You have already RSVP'd to this event!") {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: "Could not create RSVP" });
    }
}

export const updateRSVP = async (req, res) => {
    const { eventId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        const updatedRsvp = await rsvpService.updateRSVP({ eventId, userId, status });
        res.status(200).json({ message: "RSVP updated successfully!", event: updatedRsvp });
    } catch (error) {
        if (error.message === "Invalid RSVP status" || error.message === "RSVP status is required") {
            return res.status(400).json({ error: error.message });
        }

        if (error.message === "RSVP not found") {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: "Could not update RSVP" });
    }
}

export const getRSVPsByStatus = async (req, res) => {
    const userId = req.user?.id;
    const { status, q } = req.query;

    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        const events = await rsvpService.getRSVPsByStatus(userId, status, q);
        res.status(200).json({ events });
    } catch (error) {
        if (error.message === "Invalid RSVP status" || error.message === "RSVP status is required") {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: `Could not retrieve ${status} events` });
    }
}

export const getRSVPstatus = async (req, res) => {
    const userId = req.userId;
    const eventId = req.params.id;

    try {
        const rsvpStatus = await rsvpService.getRSVPstatus(userId, eventId);
        res.status(200).json(rsvpStatus);
    } catch (error) {
        res.status(500).json( { error: "Could not retrieve RSVP status" });
        console.log(error);
    }

}

export const declineRSVP = async (req, res) => {
    const userId = req.userId;
    const eventId = req.params.eventId;

    try {
        const deletedRSVP = await rsvpService.declineRSVP(userId, eventId);
        res.status(200).json({message: "RSVP was successfully cancelled!", event: deletedRSVP});
    } catch (error) {
        const status = error.message == "You have not RSVP'd to this event, so there is no RSVP to cancel" ? 404 
        : error.message === "You have not RSVP'd 'yes' to this event, so there is no RSVP to cancel" ? 403 : 500;

        const message = error.message === 500 ? "Could not cancel RSVP" : error.message;

        return res.status(status).json({ error: message });
    }
}



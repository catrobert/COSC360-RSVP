import * as rsvpService from "../services/rsvpServices.js";

export const createRSVP = async (req, res) => {
    try {
        const newRsvp = await rsvpService.createRSVP(req.body);
        res.status(201).json({ message: "RSVP created successfully!", event: newRsvp });
    } catch (error) {
        res.status(500).json({ error: "Could not create RSVP" });
    }
}
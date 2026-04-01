import * as eventService from "../services/eventServices.js";

export const getEvents = async (req, res) => {
    try {
        const query = req.query.q;
        const events = await eventService.getEvents(query);

        if (!events) {
            return res.status(404).json({ error: "Events not found" });
        }

        res.json(events);

    } catch (error) {
        console.log("Error getting events: ", error);
        res.status(500).json({ error: "Could not load events" });
    }
}

export const getEventById = async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json(event);

    } catch (error) {
        console.log("Error getting events ", error);
        res.status(500).json({ error: "Could not load event" });
    }
}

export const createEvent = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.image = "/uploads/" + req.file.filename;
        }
        const newEvent = await eventService.createEvent(data, req.userId);
        console.log("Event created:", newEvent);
        res.status(201).json({ message: "Event created successfully!", event: newEvent });
    } catch (error) {
        console.log("Error creating event: ", error);
        res.status(500).json({ error: "Could not create event" });
    }
};

export const createReview = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.userId;
        const data = {...req.body};

        const newReview = await eventService.createReview(data, eventId, userId);

        res.status(201).json({ message: "Successfully created event!", review: newReview });
    } catch (error) {
        if (error.message === "You have already reviewed this event!") {
            return res.status(400).json( {error: error.message})
        }

        console.log("Error creating review:", error);
        res.status(500).json({ error: "Could not post review" });
    }
}
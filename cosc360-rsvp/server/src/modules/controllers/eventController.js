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
        const data = { ...req.body };

        const newReview = await eventService.createReview(data, eventId, userId);

        res.status(201).json({ message: "Successfully created event!", review: newReview });
    } catch (error) {
        if (error.message === "Event not found") {
            return res.status(404).json({ error: error.message });
        }

        if (
            error.message === "You must RSVP yes before reviewing this event!" ||
            error.message === "You can only review events that have ended!"
        ) {
            return res.status(403).json({ error: error.message });
        }

        if (error.message === "You have already reviewed this event!") {
            return res.status(400).json({ error: error.message })
        }

        console.log("Error creating review:", error);
        res.status(500).json({ error: "Could not post review" });
    }
}

export const updateEvent = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.file) {
            data.image = "/uploads/" + req.file.filename;
        }
        const event = await eventService.updateEvent(req.params.id, data, req.userId, req.userRole);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json({ message: "Event updated successfully!", event });
    } catch (error) {
        if (error.message === "Forbidden") {
            return res.status(403).json({ error: "You are not the creator of this event" });
        }
        console.log("Error updating event: ", error);
        res.status(500).json({ error: "Could not update event" });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await eventService.deleteEvent(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json({ message: "Event deleted successfully!", event: deletedEvent });
    } catch (error) {
        console.log("Error deleting event: ", error);
        res.status(500).json({ error: "Could not delete event" });

    }
}

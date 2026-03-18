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
        console.log("getEventById hit, id:", req.params.id); // ← add this

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
        const newEvent = await eventService.createEvent(req.body); 
        console.log("Event created:", newEvent);
        res.status(201).json({ message: "Event created successfully!", event: newEvent });
        
    } catch (error) {
        console.log("Error creating event: ", error);
        res.status(500).json({ error: "Could not create event" });
    }
}
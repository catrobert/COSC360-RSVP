import * as eventService from "../services/eventServices.js";

export const getEvents = async (req, res) => {
    try {
        const query = req.query.q;
        const events = await eventService.getEvents(query);
        res.json(events);

    } catch (error) {
        console.log("Error getting events: ", error);
        res.status(500).json({ error: "Could not load events" });
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
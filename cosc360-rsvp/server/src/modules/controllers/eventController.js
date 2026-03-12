import { search_events } from "../services/search.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getEvents = async (req, res) => {
    try {
        const query = req.query.q;
        const filePath = path.join(__dirname, "../../data/events.json");
        const events = await search_events(query, filePath);

        res.json(events);

    } catch (error) {
        console.log("Error getting events: ", error);
        res.status(500).json({ error: "Could not load events" });
    }
}

export const createEvent = async (req, res) => {
    try {
        const filePath = path.join(__dirname, "../../data/events.json");
        
        // Read existing events
        const fileData = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileData);
        
        //find highest id so we can +1 on it for the new event
        const maxId = data.events.reduce((max, event) => Math.max(max, event.id), 0);
        
        // Create new event with generated ID and defaults
        const newEvent = {
            id: maxId + 1,
            name: req.body.name,
            date: req.body.date,
            location: req.body.location,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            attendance: 0,
            host: "TBD",
            price: parseFloat(req.body.price), //so its a number not a string
            description: req.body.description,
            reviews: []
        };
        
        // Add to events array
        data.events.push(newEvent);
        
        // Write back to file
        await fs.writeFile(filePath, JSON.stringify(data, null, 4));
        
        console.log("Event created:", newEvent);
        res.json({ message: "Event created successfully!", event: newEvent });
        
    } catch (error) {
        console.log("Error creating event: ", error);
        res.status(500).json({ error: "Could not create event" });
    }
}
import fs from "fs/promises";
import * as eventRepository from "../repository/eventRepository.js";

export async function getEvents(query) { //, filepath) {
    // try {
    //     const fileData = await fs.readFile(filepath, "utf-8");
    //     const data = JSON.parse(fileData);
    //     const events = data.events || data;  // Handle both { events: [...] } and [...]

        if (!query) {
            return await eventRepository.findAll();
            // return events; // Return all events if no query is provided
        } else {
            return await eventRepository.findBySearchTerm(query);
        }


        
    // } catch (error) {
    //     res.status(500).json({error: "Error fetching events"});
    // }
}

export async function createEvent(data) {
    const eventData =
    {
        name: data.name,
        date: new Date(data.date),
        location: data.location,
        startTime: data.startTime,
        endTime: data.endTime,
        attendance: 0,
        createdBy: "000000000000000000000001", // placeholder, when we have login we will replace this with req.user._id,
        price: parseFloat(data.price), //so its a number not a string
        description: data.description,
        reviews: []
    };
        
    return await eventRepository.createEvent(eventData);
}



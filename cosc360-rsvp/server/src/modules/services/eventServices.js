import * as eventRepository from "../repository/eventRepository.js";

export async function getEvents(query) { 
    if (!query) {
        return await eventRepository.findAll();
    } else {
        return await eventRepository.findBySearchTerm(query);
    }
}

export async function getEventById(id) {
    return await eventRepository.findEvent(id);
}

export async function deleteEvent(id) {
    return await eventRepository.deleteEvent(id);
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



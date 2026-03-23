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

export async function createEvent(data) {
    const eventData = {
        name: data.name,
        date: new Date(data.date),
        location: data.location,
        startTime: data.startTime,
        endTime: data.endTime,
        attendance: 0,
        createdBy: "000000000000000000000001",
        price: parseFloat(data.price),
        description: data.description,
        reviews: [],
    };
    if (data.image) {
        eventData.image = data.image;
    }
    return await eventRepository.createEvent(eventData);
}



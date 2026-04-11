import * as eventRepository from "../repository/eventRepository.js";
import * as rsvpRepository from "../repository/rsvpRepository.js";

function eventHasEnded(eventDate, endTime) {
    const eventDateTime = new Date(eventDate);

    if (typeof endTime === "string" && endTime.includes(":")) {
        const [hours, minutes] = endTime.split(":").map(Number);
        if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
            eventDateTime.setHours(hours, minutes, 0, 0);
        }
    }

    return eventDateTime <= new Date();
}

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

export async function deleteEvent(id, userId, userRole) {
    const event = await eventRepository.findEvent(id);
    if (!event) return null;

    const creatorId = event.createdBy?._id?.toString() || event.createdBy?.toString();
    const isAdmin = userRole === "admin";

    if (!isAdmin && creatorId !== userId?.toString()) {
        throw new Error("Forbidden");
    }

    return await eventRepository.deleteEvent(id);
}

export async function createEvent(data, userId) {
    const eventData = {
        name: data.name,
        date: new Date(data.date),
        location: data.location,
        startTime: data.startTime,
        endTime: data.endTime,
        attendance: 0,
        createdBy: userId,
        price: parseFloat(data.price),
        description: data.description,
        reviews: [],
    };
    if (data.image) {
        eventData.image = data.image;
    }
    return await eventRepository.createEvent(eventData);
}

export async function updateEvent(id, data, userId, userRole) {
    const event = await eventRepository.findEvent(id);
    if (!event) return null;
    const isAdmin = userRole === "admin";
    if (!isAdmin && event.createdBy._id.toString() !== userId.toString()) {
        throw new Error("Forbidden");
    }
    const updateData = {
        name: data.name,
        date: new Date(data.date),
        location: data.location,
        startTime: data.startTime,
        endTime: data.endTime,
        price: parseFloat(data.price),
        description: data.description,
    };
    if (data.image) {
        updateData.image = data.image;
    }
    return await eventRepository.updateEvent(id, updateData);
}

export async function createReview(data, eventId, userId) {
    const event = await eventRepository.findEvent(eventId);

    if (!event) {
        throw new Error("Event not found");
    }

    const rsvp = await rsvpRepository.findRSVP(eventId, userId);
    if (!rsvp || rsvp.status !== "yes") {
        throw new Error("You must RSVP yes before reviewing this event!");
    }

    if (!eventHasEnded(event.date, event.endTime)) {
        throw new Error("You can only review events that have ended!");
    }

    const reviewData = {
        userId: userId,
        rating: data.rating,
        comment: data.comment
    }

    const existingReview = await eventRepository.findReview(userId, eventId);

    if (existingReview) {
        throw new Error("You have already reviewed this event!")
    }

    return await eventRepository.createReview(reviewData, eventId);
}


import { EventModel } from "../model/event.model.js";

export async function createEvent(data) {
    const event = await EventModel.create(data);
    return event.toJSON();
}

export async function findAll() {
    return await EventModel.find();
}

export async function findBySearchTerm(query) {
    return await EventModel.find(
        {
            $or: [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        }
    );
}

export async function findEvent(id) {
    return await EventModel.findById(id).populate('createdBy', 'username').populate('reviews.userId', 'username');
}

export async function createReview(data, eventId) {
    const event = await EventModel.findById(eventId);
    event.reviews.push(data);
    await event.save();
    return event.toJSON();
}

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
                { name: { $regex: query, $options: "i"}},   // match if event name contains query (case insensitive)
                { description: { $regex: query, $options: "i"}} // match if description contains query (case insensitive)
            ]
        }
    )
}

export async function findEvent(id) {
    return await EventModel.findById(id);
    console.log("getEventById hit, id:", req.params.id);
}
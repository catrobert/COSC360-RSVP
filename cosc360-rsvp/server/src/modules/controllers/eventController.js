import { search_events } from "../services/search.js";


export const getEvents = async (req, res) => {
    try {
        const query = req.query.q;
        const events = await search_events(query, "./data/events.json");

        res.json(events);

    } catch (error) {
        console.log("Error getting events: ", error);
        res.status(500).json({ error: "Could not load events" });
    }
}
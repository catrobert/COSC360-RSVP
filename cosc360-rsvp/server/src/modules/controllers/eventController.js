
export const getEvents = function (req, res) {
    app.get("/events", async (req, res) => {
        let event_data = [];
        const query = req.query.q;
        try {
        if (query) {
            event_data = await search_events(query, "./src/data/events.json")
        } else {
            const file = await fs.readFile("./src/data/events.json", "utf-8");
            event_data = JSON.parse(file);
        }

        res.json(event_data);

        } catch (error) {
        console.log("Error getting events: ", error);
        res.status(500).json({ error: "Could not load events" });
        }
    })
}
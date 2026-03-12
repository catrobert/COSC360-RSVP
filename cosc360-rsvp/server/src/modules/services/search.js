import fs from "fs/promises";

export async function search_events(query, filepath) {
    try {
        const fileData = await fs.readFile(filepath, "utf-8");
        const data = JSON.parse(fileData);
        const events = data.events || data;  // Handle both { events: [...] } and [...]

        if (!query) {
            return events; // Return all events if no query is provided
        }

        let results = [];
        for (const event of events) {
            if (event.name.toLowerCase().includes(query.toLowerCase()) || event.description.toLowerCase().includes(query.toLowerCase())) {
                results.push(event);
            }
        }
        return results;
    } catch (error) {
        console.error('Error searching:', error);
        throw error;
    }
}


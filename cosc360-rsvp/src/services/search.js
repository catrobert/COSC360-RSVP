import fs from "fs/promises";

async function search(query, filepath) {
    try {
        const fileData = await fs.readFile(filepath, "utf-8");
        const data = JSON.parse(fileData);

        let results = [];
        for (const event of data) {
            if (event.title.includes(query) || event.description.includes(query)) {
                results.push(event);
            }
        }
        return results;
    } catch (error) {
        console.error('Error searching:', error);
        throw error;
    }
}
import express from "express";
import { search_events } from "./services/search.js";
import fs from "fs";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/event/search", (req, res) => {
    event_data = fs.readFileSync("../src/data/events.json");
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/events", async (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase().trim() : "";
  const filepath = "src/data/events.json";
  try {
    const results = await search_events(query, filepath);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while searching." });
  }
});
import express from "express";


import loginRouter from "./modules/services/processLogin.js";
import cors from "cors";
import fs from "fs/promises";
import search_events from "./modules/services/search.js"

const app = express();
const PORT = 3000;
app.use(cors( { origin: "http://localhost:5173" } ));

app.use(cors());
app.use(express.json());
app.use(loginRouter);


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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
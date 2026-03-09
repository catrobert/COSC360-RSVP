import express from "express";
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
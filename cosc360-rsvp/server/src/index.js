import express from "express";
import cors from "cors";
import eventRoutes from "./modules/routes/eventRoutes.js";
import loginRouter from "./modules/routes/loginRouter.js"


const app = express();
const PORT = 3000;

app.use(cors( { origin: "http://localhost:5173" } ));
app.use(express.json());
app.use("/api",loginRouter);


app.get("/api/events", async (req, res) => {
    let event_data = [];
    const query = req.query.q;
    try {
      if (query) {
        event_data = await search_events(query, "./server/src/data/events.json")
      } else {
        const file = await fs.readFile("./server/src/data/events.json", "utf-8");
        event_data = JSON.parse(file);
      }

app.use("/login", loginRouter)
app.use("/events", eventRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
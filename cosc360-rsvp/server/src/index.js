import express from "express";
import cors from "cors";
import { connectDB } from "./db/connection.js";
import eventRoutes from "./modules/routes/eventRoutes.js";

import loginRouter from "./modules/routes/loginRouter.js";
import registerRouter from "./modules/routes/registerRouter.js";
import rsvpRoutes from "./modules/routes/rsvpRoutes.js"



const app = express();
const PORT = 3000;

await connectDB();

app.use(cors( { origin: ["http://localhost:5173", "http://localhost:5174"] } ));
app.use(express.json());

app.use("/api/login", loginRouter);
app.use("/api/events", eventRoutes);

app.use("/api/register", registerRouter);
app.use("/api/rsvp", rsvpRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
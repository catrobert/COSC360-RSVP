import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connection.js";
import { seedIfEmpty } from "./seed.js";
import eventRoutes from "./modules/routes/eventRoutes.js";
import rsvpRoutes from "./modules/routes/rsvpRoutes.js"
import userRoutes from "./modules/routes/userRoutes.js";
import adminRoutes from "./modules/routes/adminRoutes.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

if (process.env.NODE_ENV !== "test"){
  await connectDB();
  await seedIfEmpty();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  })
}

app.use(cors( { origin: ["http://localhost:5173", "http://localhost:5174"] } ));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rsvp", rsvpRoutes);


export default app;
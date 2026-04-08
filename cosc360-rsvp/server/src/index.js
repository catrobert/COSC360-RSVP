import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db/connection.js";
import { seedIfEmpty } from "./seed.js";
import eventRoutes from "./modules/routes/eventRoutes.js";

import loginRouter from "./modules/routes/loginRouter.js";
import registerRouter from "./modules/routes/registerRouter.js";

import rsvpRoutes from "./modules/routes/rsvpRoutes.js"
import resetPasswordRouter from "./modules/routes/resetPasswordRouter.js";

import userRouter from "./modules/routes/userRouter.js";
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

app.use("/api/login", loginRouter);
app.use("/api/events", eventRoutes);

app.use("/api/register", registerRouter);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/reset-password", resetPasswordRouter);

app.use("/api/users", userRouter);
app.use("/api/admin", adminRoutes);


export default app;
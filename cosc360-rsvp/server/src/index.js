import express from "express";
import cors from "cors";
import { connectDB } from "./db/connection.js";
import eventRoutes from "./modules/routes/eventRoutes.js";
import loginRouter from "./modules/routes/loginRouter.js"


const app = express();
const PORT = 3000;

await connectDB();

app.use(cors( { origin: "http://localhost:5173" } ));
app.use(express.json());

app.use("/login", loginRouter)
app.use("/events", eventRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
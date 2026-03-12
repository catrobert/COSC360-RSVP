import express from "express";
import cors from "cors";
import eventRoutes from "./modules/routes/eventRoutes.js";
import loginRouter from "./modules/routes/loginRouter.js"


const app = express();
const PORT = 3000;

app.use(cors( { origin: ["http://localhost:5173", "http://localhost:5174"] } ));
app.use(express.json());

app.use("/api/login", loginRouter);
app.use("/api/events", eventRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
import express from "express";
import { getEvents } from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);

// *** to be implemented later ***
// router.get("/:id", getEventById); 
// router.post("/", createEvent);
// router.delete("/:id", deleteEvent);
// router.put("/:id", editEvent);

export default router;
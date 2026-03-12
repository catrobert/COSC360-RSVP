import express from "express";
import { getEvents, createEvent } from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvent);

// *** to be implemented later ***
// router.get("/:id", getEventById); 
// router.delete("/:id", deleteEvent);
// router.put("/:id", editEvent);

export default router;
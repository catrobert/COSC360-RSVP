import express from "express";
import * as eventController from "../controllers/eventController.js";
import { uploadImage } from "../middleware.js";

const router = express.Router();

router.get("/", eventController.getEvents);
router.post("/", uploadImage.single("image"), eventController.createEvent);
router.get("/:id", eventController.getEventById);

// *** to be implemented later ***
// router.delete("/:id", deleteEvent);
// router.put("/:id", editEvent);

export default router;
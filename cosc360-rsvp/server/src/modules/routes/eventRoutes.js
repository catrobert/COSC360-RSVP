import express from "express";
import * as eventController from "../controllers/eventController.js";
import { uploadImage } from "../middleware.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

router.get("/", eventController.getEvents);
router.post("/", authMiddleware, uploadImage.single("image"), eventController.createEvent);
router.post("/review/:id", authMiddleware, eventController.createReview);
router.get("/:id", eventController.getEventById);
router.delete("/:id", eventController.deleteEvent);

// *** to be implemented later ***
// router.delete("/:id", deleteEvent);
// router.put("/:id", editEvent);

export default router;
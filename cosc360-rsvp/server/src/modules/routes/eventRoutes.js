import express from "express";
import * as eventController from "../controllers/eventController.js";
import { uploadImage } from "../middleware.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

router.get("/", eventController.getEvents);
router.post("/", authMiddleware, uploadImage.single("image"), eventController.createEvent);
router.post("/review/:id", authMiddleware, eventController.createReview);
router.get("/:id", eventController.getEventById);
router.put("/:id", authMiddleware, uploadImage.single("image"), eventController.updateEvent);
router.delete("/:id", authMiddleware, eventController.deleteEvent);

export default router;
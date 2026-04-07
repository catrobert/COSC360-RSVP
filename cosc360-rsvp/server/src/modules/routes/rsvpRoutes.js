import express from "express";
import * as rsvpController from "../controllers/rsvpController.js";
import { requireUser, authMiddleware } from "../middleware.js";

const router = express.Router();

router.use(requireUser);

router.get("/", (req, res) => {
    res.status(200).json({ message: "RSVP route is working!" });
});
router.get("/events", rsvpController.getRSVPsByStatus);
router.post("/", authMiddleware, rsvpController.createRSVP);
router.get("/events/:id", authMiddleware, rsvpController.getRSVPstatus);
router.put("/:eventId", rsvpController.updateRSVP);
router.patch("/:eventId", authMiddleware, rsvpController.declineRSVP)

export default router;
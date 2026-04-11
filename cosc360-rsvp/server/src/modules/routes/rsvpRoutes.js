import express from "express";
import * as rsvpController from "../controllers/rsvpController.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", (req, res) => {
    res.status(200).json({ message: "RSVP route is working!" });
});
router.get("/events", rsvpController.getRSVPsByStatus);
router.post("/", rsvpController.createRSVP);
router.get("/events/:id", rsvpController.getRSVPstatus);
router.put("/:eventId", rsvpController.updateRSVP);
router.patch("/:eventId", rsvpController.declineRSVP)

export default router;
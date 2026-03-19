import express from "express";
import * as rsvpController from "../controllers/rsvpController.js";

const router = express.Router();

router.post("/", rsvpController.createRSVP);

export default router;
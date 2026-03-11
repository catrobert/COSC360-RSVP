import express from "express";
import {getEvents, getEventById, createEvent, deleteEvent, editEvent} from "../controllers/eventController";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.delete("/:id", deleteEvent);
router.put("/:id", editEvent);
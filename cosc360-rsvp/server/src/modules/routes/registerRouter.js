import express from "express";
import { processRegister } from "../controllers/registerController.js";

const router = express.Router();

router.post("/", processRegister);

export default router;
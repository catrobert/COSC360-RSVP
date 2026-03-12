import express from "express";
import { processLogin } from "../controllers/loginController.js";

const router = express.Router();

router.post("/login", processLogin);

export default router;
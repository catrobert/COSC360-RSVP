import express from "express";
import { processResetPassword } from "../controllers/resetPasswordController.js";

const router = express.Router();

router.post("/", processResetPassword);

export default router;
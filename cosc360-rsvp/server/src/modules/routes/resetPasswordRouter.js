import express from "express";
import { processResetPassword } from "../controllers/resetPasswordController.js";

const router = express.Router();

router.put("/", processResetPassword);

export default router;
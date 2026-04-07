import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

app.get('/analytics', authMiddleware, adminController.getAnalytics);

export default router;
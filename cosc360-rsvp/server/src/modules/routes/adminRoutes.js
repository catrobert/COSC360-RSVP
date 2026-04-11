import express from "express";
import * as adminController from "../controllers/adminController.js";
import { authMiddleware } from "../middleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminController.listUsers);
router.get('/analytics', authMiddleware, adminController.getAnalytics);
router.put("/:id/role", authMiddleware, adminController.updateUserRole);
router.delete("/:id", authMiddleware, adminController.deleteUser);
router.patch("/:id/activation", authMiddleware, adminController.updateUserActivation);

export default router;
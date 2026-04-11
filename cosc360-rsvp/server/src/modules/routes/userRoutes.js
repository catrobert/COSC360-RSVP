import express from "express";
import * as userController from "../controllers/userController.js"
import { uploadImage, authMiddleware } from "../middleware.js";

const router = express.Router();

router.post("/register", uploadImage.single("profilePhoto"), userController.createUser);
router.post("/reset-password", userController.updatePassword);
router.post("/login", userController.loginUser);
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.post("/profile/photo", authMiddleware, uploadImage.single("profilePhoto"), userController.uploadPhoto);

export default router;
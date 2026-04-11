import express from "express";
import { getProfile, updateProfile, uploadPhoto, createUser, loginUser, updatePassword } from "../controllers/userController.js";
import { uploadImage, authMiddleware } from "../middleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/reset-password", updatePassword);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/photo", uploadImage.single("profilePhoto"), uploadPhoto);

export default router;
import express from "express";
import { getProfile, updateProfile, uploadPhoto } from "../controllers/userController.js";
import { uploadImage } from "../middleware.js";

const router = express.Router();

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/photo", uploadImage.single("profilePhoto"), uploadPhoto);

export default router;
import express from "express";
import { getProfile, updateProfile, uploadPhoto, listUsers, deleteUser, updateUserRole, createUser, loginUser, updatePassword } from "../controllers/userController.js";
import { uploadImage, authMiddleware } from "../middleware.js";

const router = express.Router();

app.post("/register", createUser);
app.post("/reset-password", updatePassword);
app.post("/login", loginUser);
router.get("/", authMiddleware, listUsers);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/photo", uploadImage.single("profilePhoto"), uploadPhoto);
router.delete("/:id", authMiddleware, deleteUser);
router.put("/:id/role", authMiddleware, updateUserRole);

export default router;
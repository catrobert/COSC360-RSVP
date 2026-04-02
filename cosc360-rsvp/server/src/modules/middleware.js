import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import * as userRepository from "./repository/userRepository.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + (file.originalname || "image");
        cb(null, unique);
    },
});


export const uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});


export const requireUser = (req, res, next) => {
	const userId = req.header("x-user-id");

	if (!userId) {
		return res.status(401).json({ error: "User not authenticated" });
	}

	req.user = { id: userId };
	next();
};


export async function authMiddleware(req, res, next) {
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({error: "Missing user ID header" });
    }

    const user = await userRepository.findUser(userId);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    req.userId = userId; // req.userId now available to everything after
    next();
}
import bcrypt from "bcryptjs";
import { resetPassword } from "../services/userServices.js";
import { UserSchema } from "../model/user.model.js";

export const processResetPassword = async (req, res) => {
    const { username, newPassword, confirmPassword } = req.body || {};

    if (
        typeof username !== "string" ||
        typeof newPassword !== "string" ||
        typeof confirmPassword !== "string"
    ) {
        return res.status(400).json({ error: "Username, newPassword, and confirmPassword are required" });
    }

    const normalizedUsername = username.trim();
    const normalizedNewPassword = newPassword;
    const normalizedConfirmPassword = confirmPassword;

    if (!normalizedUsername || !normalizedNewPassword || !normalizedConfirmPassword) {
        return res.status(400).json({ error: "Username, newPassword, and confirmPassword are required" });
    }

    if (normalizedNewPassword.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Bcrypt only uses the first 72 bytes; reject oversized values to avoid silent truncation.
    if (normalizedNewPassword.length > 72) {
        return res.status(400).json({ error: "Password must be 72 characters or fewer" });
    }

    if (normalizedNewPassword !== normalizedConfirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
    }

    try {
        const existingUser = await UserSchema.findOne({ username: normalizedUsername });
        if (!existingUser) {
            return res.status(404).json({ error: "Username not found" });
        }

        const isSamePassword = await bcrypt.compare(normalizedNewPassword, existingUser.password);

        if (isSamePassword) {
            return res.status(400).json({ error: "New password must be different from current password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(normalizedNewPassword, salt);

        await resetPassword(normalizedUsername, hashedPassword);

        res.status(200).json({ success: true, message: "Password reset successfully" });


    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
}
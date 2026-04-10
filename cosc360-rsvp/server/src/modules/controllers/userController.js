import { getUserById, updateUserById, getAllUsers, deleteUserById } from "../services/userServices.js";

function resolveProfileUserId(req, res) {
    const authenticatedUserId = req.userId?.toString();

    if (!authenticatedUserId) {
        res.status(401).json({ error: "User not authenticated" });
        return null;
    }

    const requestedUserId = req.query.userId?.toString();

    if (requestedUserId && requestedUserId !== authenticatedUserId) {
        res.status(403).json({ error: "Forbidden" });
        return null;
    }

    return authenticatedUserId;
}

export const getProfile = async (req, res) => {
    try {
        const userId = resolveProfileUserId(req, res);

        if (!userId) {
            return;
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = resolveProfileUserId(req, res);
        const updates = req.body;
        console.log("Updating user: ", userId, updates);

        if (!userId) {
            return;
        }

        delete updates.password;

        const user = await updateUserById(userId, updates);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });

    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

export const uploadPhoto = async (req, res) => {
    try {
        const userId = resolveProfileUserId(req, res);

        if (!userId) {
            return;
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uplaoded" });
        }

        const photoPath = "/uploads/" + req.file.filename;
        const user = await updateUserById(userId, { profilePhoto: photoPath });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        console.error("Error uploading photo: ", err);
        res.status(500).json({ error: "Something went wrong" });
    }
}

export const listUsers = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const users = await getAllUsers();
        res.json({ users });
    } catch (err) {
        console.error("Error listing users:", err);
        res.status(500).json({ error: "Could not load users" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { id } = req.params;
        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await deleteUserById(id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { id } = req.params;
        const { role } = req.body;

        console.log("Updating role for user: ", id, "to: ", role);

        if (!role) {
            return res.status(400).json({ error: "Missing role" });
        }

        const user = await updateUserById(id, { role });
        console.log("Updated user:", user);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        console.error("Error updating user role: ", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
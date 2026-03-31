import { getUserById, updateUserById } from "../services/userServices.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.query.userId;

        if(!userId) {
            return res.status(400).json({ error: "Missing userId"});
        }

        const user = await getUserById(userId);

        if(!user){
            return res.status(404).json({ error: "User not found"});
        }

        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong"});
    }
};

export const updateProfile = async (req, res) => {
    try{
        const userId = req.query.userId;
        const updates = req.body;

        if(!userId) {
            return res.status(400).json({ error: "Missing userId"});
        }

        delete updates.password;

        const user = await updateUserById(userId, updates);

        if(!user){
            return res.status(404).json({ error: "User not found"});
        }


    } catch (err){
        res.status(500).json({ error: "Something went wrong"});
    }
}
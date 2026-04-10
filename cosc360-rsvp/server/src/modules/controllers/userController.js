import * as userServices from "../services/userServices.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    try{ 
        //checks if username is unique
        const existingUser = await userServices.findUsername(username);
        
        if(existingUser){
            return res.status(400).json({ error: "Username is already taken"});
        }

        await userServices.createUser(firstName, lastName, username, password);

        res.status(201).json({ success: true, message: "User registered successfully"});

    } catch (err) {
        res.status(500).json({ error: "Something went wrong"});
        console.log(err);
    }

}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userServices.findUsername(username);

        if (!user) {
            return res.status(401).json({ error: "Invalid username" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Invalid password" });
        }

        res.json({ success: true, message: "Login Successful",
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
         });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
        console.log(err);
    }
};

export const updatePassword = async (req, res) => {
    const { username, newPassword, confirmPassword } = req.body;

    if(newPassword !== confirmPassword){
        return res.status(400).json({ error: "Passwords don't match"});
    }

    try{
        const existingUser = await userServices.findUsername(username);
        
        if(!existingUser){
            return res.status(404).json({ error: "Username not found"});
        }

        await userServices.updatePassword(username, newPassword);

        res.status(200).json({ success: true, message: "Password reset successfully"});       
    }catch(err){
        res.status(500).json({ error: "Something went wrong"});
    }
}



export const getProfile = async (req, res) => {
    try {
        const userId = req.query.userId;

        if(!userId) {
            return res.status(400).json({ error: "Missing userId"});
        }

        const user = await userServices.getUserById(userId);

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
        console.log("Updating user: ", userId, updates);

        if(!userId) {
            return res.status(400).json({ error: "Missing userId"});
        }

        delete updates.password;

        const user = await userServices.updateUserById(userId, updates);

        if(!user){
            return res.status(404).json({ error: "User not found"});
        }

        res.json({user});

    } catch (err){
        res.status(500).json({ error: "Something went wrong"});
    }
}

export const uploadPhoto = async (req, res) => {
    try{
        const userId = req.query.userId;

        if(!userId){
            return res.status(400).json({ error: "Missing userId"});
        }

        if(!req.file){
            return res.status(400).json({ error: "No file uplaoded"});
        }

        const photoPath = "/uploads/" + req.file.filename;
        const user = await userServices.updateUserById(userId, {profilePhoto: photoPath });

        if(!user){
            return res.status(404).json({ error: "User not found"});
        }

        res.json({ user });
    } catch (err){
        console.error("Error uploading photo: ", err);
        res.status(500).json({ error: "Something went wrong"});
    }
}

export const listUsers = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const users = await userServices.getAllUsers();
        res.json({ users });
    } catch (err) {
        console.error("Error listing users:", err);
        res.status(500).json({ error: "Could not load users" });
    }
};

export const deleteUser = async (req, res) => {
    try{
        if(req.userRole !== "admin"){
            return res.status(403).json({ error: "Forbidden"});
        }

        const { id } = req.params;
        const user = await userServices.getUserById(id);

        if(!user){
            return res.status(404).json({ error: "User not found"});
        }

        await userServices.deleteUserById(id);
        res.json({ message: "User deleted successfully"});
    }catch (err){
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Something went wrong"});
    }
};

export const updateUserRole = async (req, res) => {
    try{
        if(req.userRole !== "admin"){
            return res.status(403).json({ error: "Forbidden"});
        }

        const { id } = req.params;
        const { role } = req.body;

        console.log("Updating role for user: ", id, "to: ", role);

        if(!role){
            return res.status(400).json({ error: "Missing role"});
        }

        const user = await userServices.updateUserById(id, {role});
        console.log("Updated user:", user);

        if(!user){
            return res.status(404).json({ error: "User not found"});
        }

        res.json({ user });
    }catch (err){
        console.error("Error updating user role: ", err);
        res.status(500).json({ error: "Something went wrong"});
    }
};
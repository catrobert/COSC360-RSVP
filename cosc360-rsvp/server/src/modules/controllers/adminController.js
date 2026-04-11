import * as adminService from "../services/adminServices.js";

export const getAnalytics = async (req, res) => {
    try {
        const role = req.userRole;

        if (role !== 'admin') {
            return res.status(403).json( { error: "You are not permitted to view this page" });
        }

        const analytics = await adminService.getAnalytics();
        
        res.status(200).json(analytics);

    } catch (error) {
        console.log("Error retrieving analytics: ", error);
        res.status(500).json({ error: "Could not retrieve analytics" });
    }
}

export const listUsers = async (req, res) => {
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const users = await adminService.getAllUsers();
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
        const user = await adminService.getUserById(id);

        if(!user){
            return res.status(404).json({ error: "User not found"});
        }

        await adminService.deleteUserById(id);
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

        const user = await adminService.updateUserById(id, {role});
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
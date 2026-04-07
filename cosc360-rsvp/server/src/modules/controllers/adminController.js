import * as adminService from "../services/adminServices.js";

export const getAnalytics = async (req, res) => {
    try {
        userId = req.userId;

        const role = await adminService.getRole(userId);

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
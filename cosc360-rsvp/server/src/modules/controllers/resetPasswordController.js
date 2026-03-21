import bcrypt from "bcryptjs";
import { resetPassword } from "../services/userServices.js";
import { UserSchema } from "../model/user.model.js";

export const processResetPassword = async (req, res) => {
    const { username, newPassword, confirmPassword } = req.body;

    if(newPassword !== confirmPassword){
        return res.status(400).json({ error: "Passwords don't match"});
    }

    try{
        const existingUser = await UserSchema.findOne({username});
        if(!existingUser){
            return res.status(404).json({ error: "Username not found"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await resetPassword(username, hashedPassword);

        res.status(200).json({ success: true, message: "Password reset successfully"});
        
    
    }catch(err){
        res.status(500).json({ error: "Something went wrong"});
    }
}
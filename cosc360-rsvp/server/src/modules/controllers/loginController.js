import bcrypt from "bcryptjs";
import { UserSchema } from "../model/user.model.js";


export const processLogin = async (req,res) => {
    const { username, password } = req.body;

    try {
        //find user with input username
        const user = await UserSchema.findOne({ username });

        if(!user) {
            return res.status(401).json({ error: "Invalid Credentials"});
        }

        //compare password with stored hash password

        const match = await bcrypt.compare(password, user.password);

        if(!match){
            return res.status(401).json({ error: "Invalid Credentials"})
        }

        //if successful

        res.json({ success: true, message: "Login Successful"});

    }catch (err) {
        res.status(500).json({ error: "Something went wrong"});
    }

}

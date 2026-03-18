import bcrypt from "bcryptjs";
import { UserSchema } from "../model/user.model.js";

export const processRegister = async (req, res) => {
    const { firstName, lastName, username, password } = req.body;

    try{ 
        //checks if username is unique
        const existingUser = await UserSchema.findOne({username});
        if(existingUser){
            return res.status(400).json({ error: "Username is already taken"});
        }

        //hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //save the user to DB

        const newUser = new UserSchema({
            firstName,
            lastName,
            username,
            password: hashedPassword,
            createdDate: new Date(),
            role: "user"
        });

        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully"});

    } catch (err) {
        res.status(500).json({ error: "Something went wrong"});
    }

}
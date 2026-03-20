import { UserSchema } from "../model/user.model.js";

export const saveUser = async ({ firstName, lastName, username, hashedPassword}) => {
    const newUser = new UserSchema({
        firstName,
        lastName,
        username,
        password: hashedPassword,
        createdDate: new Date(),
        role: "user"
    });

    return await newUser.save();
}
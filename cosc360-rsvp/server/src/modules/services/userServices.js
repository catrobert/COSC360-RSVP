import { UserSchema } from "../model/user.model.js";

export const saveUser = async ({ firstName, lastName, username, hashedPassword }) => {
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

export const resetPassword = async (username, newHashedPassword) => {
    return await UserSchema.findOneAndUpdate(
        { username },
        { password: newHashedPassword },
        { new: true, runValidators: true }
    );
}

export async function getUserById(id) {
    return await UserSchema.findById(id).select("-password");
}

export async function updateUserById(id, updates) {
    return await UserSchema.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    ).select("-password");
}

export async function getAllUsers() {
    return await UserSchema.find().select("-password");
}

export async function deleteUserById(id) {
    return await UserSchema.findByIdAndDelete(id);
}
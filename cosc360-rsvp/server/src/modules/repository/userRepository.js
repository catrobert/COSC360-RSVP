import { UserSchema } from "../model/user.model.js";

export async function findUsername(username) {
    return UserSchema.findOne({username});
}

export async function findUser(id) {
    return await UserSchema.findOne({ _id : id }); 
}

export async function createUser(userData) {
    await UserSchema.create(userData);
}

export async function getUserById(id) {
    return await UserSchema.findById(id).select("-password");
}

export async function updatePassword(username, newHashedPassword) {
    return await UserSchema.findOneAndUpdate(
        { username },
        { password: newHashedPassword},
        { new: true }
    );
}

export async function getAllUsers() {
    return await UserSchema.find().select("-password");
}

export async function deleteUserById(id){
    return await UserSchema.findByIdAndDelete(id);
}

export async function updateUserById (id, updates) {
    return await UserSchema.findByIdAndUpdate(
        id,
        updates,
        { new: true}
    ).select("-password");
}
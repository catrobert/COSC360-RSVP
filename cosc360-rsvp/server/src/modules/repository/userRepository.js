import { UserModel } from "../models/userModel.js";

export async function findUser(id) {
    return await UserModel.findOne({ _id : id }); 
}

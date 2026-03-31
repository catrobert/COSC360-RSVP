import { UserSchema } from "../model/user.model.js";

export async function findUser(id) {
    return await UserSchema.findOne({ _id : id }); 
}

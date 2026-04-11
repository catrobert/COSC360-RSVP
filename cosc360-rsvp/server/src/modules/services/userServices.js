import * as userRepository from "../repository/userRepository.js";
import bcrypt from "bcryptjs";

export const findUsername = async (username) => {
    return await userRepository.findUsername(username);
}

export const createUser = async (firstName, lastName, username, password) => {
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: hashedPassword,
        createdDate: new Date(),
        role: "user"
    };

    return await userRepository.createUser(newUser);
}

export const updatePassword = async (username, newPassword) => {
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    
    return await userRepository.updatePassword(username, newHashedPassword);
}

export async function getUserById(id) {
    return await userRepository.getUserById(id);
}
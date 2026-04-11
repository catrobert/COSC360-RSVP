import { apiClient } from "../../../lib/api-client.js";

export async function resetPass(username, newPassword, confirmPassword){
    const data = await apiClient("/users/reset-password", {
        method: "POST",
        body: {username, newPassword, confirmPassword}
    })

    return data;
}

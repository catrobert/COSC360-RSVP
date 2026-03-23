import { apiClient } from "../../../lib/api-client.js";

export async function resetPass(username, newPassword, confirmPassword){
    const data = await apiClient("/reset-password", {
        method: "PUT",
        body: {username, newPassword, confirmPassword}
    })

    return data;
}

import { apiClient } from "../../../lib/api-client.js";

export async function loginApi(username, password){
    const data = await apiClient("/users/login", {
        method: "POST",
        body: {username, password},
    });

    return data;
}
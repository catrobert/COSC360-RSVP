import { apiClient } from "../../../lib/api-clients.js";

export async function loginApi(username, password){
    const data = await apiClient("/login", {
        method: "POST",
        body: {username, password},
    });

    return data;
}
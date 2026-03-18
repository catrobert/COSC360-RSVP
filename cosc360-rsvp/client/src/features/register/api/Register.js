import {apiClient} from "../../lib/api-client.js";

export async function registerApi(firstName, lastName, userName, password){
    const data = await apiClient("/auth/register", {
        method: "POST",
        body: { firstName, lastName, userName, password },
    });

    return data;
}
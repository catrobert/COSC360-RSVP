import {apiClient} from "../../../lib/api-client.js";

export async function registerApi(firstName, lastName, username, password){
    const data = await apiClient("/register", {
        method: "POST",
        body: { firstName, lastName, username, password },
    });

    return data;
}
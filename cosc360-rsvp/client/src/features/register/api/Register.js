import {apiClient} from "../../../lib/api-client.js";

export async function registerApi(firstName, lastName, username, email, password, profilePhoto){
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePhoto", profilePhoto);

    const data = await apiClient("/users/register", {
        method: "POST",
        body: formData,
    });

    return data;
}
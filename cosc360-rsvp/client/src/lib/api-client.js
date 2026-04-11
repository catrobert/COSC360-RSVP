const BASE_URL = "/api";

function getActiveUserIdFromStorage() {
    try {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        const parsedUser = JSON.parse(savedUser);
        return parsedUser?.id || parsedUser?._id || null;
    } catch {
        return null;
    }
}

export async function apiClient(url, options = {}) {
    const { method = "GET", body, headers: customHeaders = {} } = options;

    const activeUserId = getActiveUserIdFromStorage();
    const isFormData = body instanceof FormData;

    const headers = {
        ...customHeaders,
    }

    if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    if (activeUserId && !headers["x-user-id"]) {
        headers["x-user-id"] = activeUserId;
    }

    const response = await fetch(`${BASE_URL}${url}`, {
        method,
        headers,
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
    }

    return data;
}


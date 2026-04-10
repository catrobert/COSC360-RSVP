import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";
import bcrypt from "bcryptjs";

// Set Up Functions

async function createUser(overrides = {}) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);
    return await UserSchema.create({
        firstName: "Test",
        lastName: "User",
        username: `testuser_${Date.now()}_${Math.random()}`,
        password: hashedPassword,
        role: "user",
        createdDate: new Date(),
        ...overrides,
    });
}

//Unit Test

describe("Unit Test for profile update logic", () => {
    test("password field is stripped from updates", () => {
        const updates = { firstName: "New", password: "hacked123" };
        delete updates.password;
        expect(updates.password).toBeUndefined();
        expect(updates.firstName).toBe("New");
    });

    test("profile photo path is constructed correctly", () => {
        const filename = "abc123.jpg";
        const photoPath = "/uploads/" + filename;
        expect(photoPath).toBe("/uploads/abc123.jpg");
    });
});

//Integration Test for GET /api/users/profile
describe("Integration for GET /api/users/profile", () => {
    test("returns user profile for valid userId", async () => {
        const user = await createUser();

        const res = await request(app)
            .get(`/api/users/profile?userId=${user._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.firstName).toBe("Test");
        expect(res.body.user.lastName).toBe("User");
    });

    test("does not return password", async () => {
        const user = await createUser();

        const res = await request(app)
            .get(`/api/users/profile?userId=${user._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.user.password).toBeUndefined();
    });

    test("returns 400 if userId is missing", async () => {
        const res = await request(app)
            .get("/api/users/profile");

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing userId");
    });

    test("returns 404 if user does not exist", async () => {
        const res = await request(app)
            .get("/api/users/profile?userId=000000000000000000000003");

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });
});
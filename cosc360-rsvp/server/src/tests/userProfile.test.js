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

describe("Profile endpoints", () => {
    describe("GET /api/users/profile", () => {
        test("returns 401 when auth header is missing", async () => {
            const res = await request(app).get("/api/users/profile");

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe("Missing user ID header");
        });

        test("returns authenticated user's profile", async () => {
            const user = await createUser();

            const res = await request(app)
                .get("/api/users/profile")
                .set("x-user-id", user._id.toString());

            expect(res.statusCode).toBe(200);
            expect(res.body.user).toBeDefined();
            expect(res.body.user._id.toString()).toBe(user._id.toString());
        });

        test("returns 403 for cross-user profile query", async () => {
            const user = await createUser();
            const otherUser = await createUser();

            const res = await request(app)
                .get("/api/users/profile")
                .set("x-user-id", user._id.toString())
                .query({ userId: otherUser._id.toString() });

            expect(res.statusCode).toBe(403);
            expect(res.body.error).toBe("Forbidden");
        });
    });

    describe("PUT /api/users/profile", () => {
        test("updates authenticated user's profile", async () => {
            const user = await createUser({ firstName: "Before" });

            const res = await request(app)
                .put("/api/users/profile")
                .set("x-user-id", user._id.toString())
                .send({ firstName: "After" });

            expect(res.statusCode).toBe(200);
            expect(res.body.user.firstName).toBe("After");

            const updated = await UserSchema.findById(user._id);
            expect(updated.firstName).toBe("After");
        });

        test("returns 403 for cross-user update query", async () => {
            const user = await createUser({ firstName: "Owner" });
            const otherUser = await createUser();

            const res = await request(app)
                .put("/api/users/profile")
                .set("x-user-id", user._id.toString())
                .query({ userId: otherUser._id.toString() })
                .send({ firstName: "Hacked" });

            expect(res.statusCode).toBe(403);
            expect(res.body.error).toBe("Forbidden");

            const stillOwner = await UserSchema.findById(user._id);
            const stillOther = await UserSchema.findById(otherUser._id);
            expect(stillOwner.firstName).toBe("Owner");
            expect(stillOther.firstName).not.toBe("Hacked");
        });

        test("ignores sensitive fields when valid profile fields are provided", async () => {
            const user = await createUser({ firstName: "Before", role: "user" });

            const res = await request(app)
                .put("/api/users/profile")
                .set("x-user-id", user._id.toString())
                .send({
                    firstName: "After",
                    role: "admin",
                    adminCreatedDate: "2026-01-01T00:00:00.000Z",
                    profilePhoto: "/uploads/evil.png",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.user.firstName).toBe("After");
            expect(res.body.user.role).toBe("user");

            const updated = await UserSchema.findById(user._id);
            expect(updated.firstName).toBe("After");
            expect(updated.role).toBe("user");
            expect(updated.adminCreatedDate).toBeUndefined();
            expect(updated.profilePhoto).toBeUndefined();
        });

        test("returns 400 when payload has no valid profile fields", async () => {
            const user = await createUser({ role: "user" });

            const res = await request(app)
                .put("/api/users/profile")
                .set("x-user-id", user._id.toString())
                .send({
                    role: "admin",
                    adminCreatedDate: "2026-01-01T00:00:00.000Z",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("No valid profile fields provided");

            const unchanged = await UserSchema.findById(user._id);
            expect(unchanged.role).toBe("user");
            expect(unchanged.adminCreatedDate).toBeUndefined();
        });

        test("returns 200 when profile update payload is accepted by current update path", async () => {
            const user = await createUser({
                description: [{
                    birthday: new Date("2000-01-01"),
                    gender: "Male",
                    location: "Kelowna",
                }],
            });

            const res = await request(app)
                .put("/api/users/profile")
                .set("x-user-id", user._id.toString())
                .send({
                    description: [{
                        birthday: "2000-01-01",
                        gender: "NotAValidGender",
                        location: "Kelowna",
                    }],
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.user).toBeDefined();
        });
    });

    describe("POST /api/users/profile/photo", () => {
        test("returns 401 when auth header is missing", async () => {
            const res = await request(app).post("/api/users/profile/photo");

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe("Missing user ID header");
        });

        test("returns 403 for cross-user photo query", async () => {
            const user = await createUser();
            const otherUser = await createUser();

            const res = await request(app)
                .post("/api/users/profile/photo")
                .set("x-user-id", user._id.toString())
                .query({ userId: otherUser._id.toString() });

            expect(res.statusCode).toBe(403);
            expect(res.body.error).toBe("Forbidden");
        });

        test("returns 400 when no photo is uploaded", async () => {
            const user = await createUser();

            const res = await request(app)
                .post("/api/users/profile/photo")
                .set("x-user-id", user._id.toString());

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe("No file uploaded");
        });
    });
});

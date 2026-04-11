import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";

let uniqueCounter = 0;

async function createUser(overrides = {}) {
    uniqueCounter += 1;

    return await UserSchema.create({
        firstName: "Profile",
        lastName: "Tester",
        username: `profile_user_${uniqueCounter}`,
        password: "password123",
        createdDate: new Date(),
        role: "user",
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

        test("returns 500 when profile update violates schema validators", async () => {
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

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Something went wrong");

            const unchanged = await UserSchema.findById(user._id);
            expect(unchanged.description[0].gender).toBe("Male");
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
            expect(res.body.error).toBe("No file uplaoded");
        });
    });
});
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

//Integration Tests for PUT /api/users/profile

describe("Integration for PUT /api/users/profile", () => {
    test("updates firstName and lastName successfully", async () => {
        const user = await createUser();

        const res = await request(app)
            .put(`/api/users/profile?userId=${user._id}`)
            .send({ firstName: "Updated", lastName: "Name" });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.firstName).toBe("Updated");
        expect(res.body.user.lastName).toBe("Name");
    });

    test("does not allow password to be updated", async () => {
        const user = await createUser();

        const res = await request(app)
            .put(`/api/users/profile?userId=${user._id}`)
            .send({ firstName: "Hacker", password: "newpassword" });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.password).toBeUndefined();
    });

    test("returns 400 if userId is missing", async () => {
        const res = await request(app)
            .put("/api/users/profile")
            .send({ firstName: "Test" });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing userId");
    });

    test("returns 404 if user does not exist", async () => {
        const res = await request(app)
            .put("/api/users/profile?userId=000000000000000000000002")
            .send({ firstName: "Ghost" });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });

    test("does not return password in response", async () => {
        const user = await createUser();

        const res = await request(app)
            .put(`/api/users/profile?userId=${user._id}`)
            .send({ firstName: "Safe" });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.password).toBeUndefined();
    });
});

//Integration Tests For POST /api/users/profile/photo 

describe("Integration for POST /api/users/profile/photo", () => {
    test("returns 400 if userId is missing", async () => {
        const res = await request(app)
            .post("/api/users/profile/photo")
            .attach("profilePhoto", Buffer.from("fake image data"), "test.jpg");

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing userId");
    });

    test("returns 400 if no file is uploaded", async () => {
        const user = await createUser();

        const res = await request(app)
            .post(`/api/users/profile/photo?userId=${user._id}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("No file uplaoded");
    });

    test("uploads profile photo successfully", async () => {
        const user = await createUser();

        const res = await request(app)
            .post(`/api/users/profile/photo?userId=${user._id}`)
            .attach("profilePhoto", Buffer.from("fake image data"), "test.jpg");

        expect(res.statusCode).toBe(200);
        expect(res.body.user.profilePhoto).toMatch(/^\/uploads\//);
    });

    test("returns 404 if user does not exist", async () => {
        const res = await request(app)
            .post("/api/users/profile/photo?userId=000000000000000000000002")
            .attach("profilePhoto", Buffer.from("fake image data"), "test.jpg");

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });
});

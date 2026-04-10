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

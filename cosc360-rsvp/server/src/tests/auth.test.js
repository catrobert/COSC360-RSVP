import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";
import bcrypt from "bcryptjs";

describe("Auth/Register", () => {

    test("register a new user successfully", async () => {
        const res = await request(app).post("/api/users/register").send({
            firstName: "Test",
            lastName: "User",
            username: "testuser_unique",
            password: "password123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User registered successfully");
    });

    test("returns 400 if username already taken", async () => {
        //creates a user first
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);
        await UserSchema.create({
            firstName: "Existing",
            lastName: "User",
            username: "takenuser",
            password: hashedPassword,
            role: "user",
            createdDate: new Date(),
        })

        //try to register with same username
        const res = await request(app).post("/api/users/register").send({
            firstName: "Existing",
            lastName: "User",
            username: "takenuser",
            password: "password123"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username is already taken");
    });

    test("returns 500 if required fields are missing", async () => {
        const res = await request(app).post("/api/users/register").send({
            username: "nopassword",
        });

        expect(res.statusCode).toBe(500);
    });
});

describe("Auth/Reset Password", () => {
    async function createAuthUser(overrides = {}) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        return await UserSchema.create({
            firstName: "Reset",
            lastName: "User",
            username: `reset_user_${Date.now()}_${Math.random()}`,
            password: hashedPassword,
            role: "user",
            createdDate: new Date(),
            ...overrides,
        });
    }

    test("resets password successfully with valid payload", async () => {
        const user = await createAuthUser({ username: "reset_success_user" });

        const res = await request(app).post("/api/reset-password").send({
            username: user.username,
            newPassword: "newpassword123",
            confirmPassword: "newpassword123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Password reset successfully");

        const updated = await UserSchema.findOne({ username: user.username });
        const matches = await bcrypt.compare("newpassword123", updated.password);
        expect(matches).toBe(true);
    });

    test("returns 400 when required reset fields are missing", async () => {
        const res = await request(app).post("/api/reset-password").send({
            username: "",
            newPassword: "",
            confirmPassword: "",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username, newPassword, and confirmPassword are required");
    });

    test("returns 400 when reset payload field types are invalid", async () => {
        const res = await request(app).post("/api/reset-password").send({
            username: 123,
            newPassword: ["password123"],
            confirmPassword: { value: "password123" },
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username, newPassword, and confirmPassword are required");
    });

    test("returns 400 when passwords do not match", async () => {
        const user = await createAuthUser({ username: "reset_mismatch_user" });

        const res = await request(app).post("/api/reset-password").send({
            username: user.username,
            newPassword: "newpassword123",
            confirmPassword: "differentpassword123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Passwords don't match");
    });

    test("returns 400 when password is too short", async () => {
        const user = await createAuthUser({ username: "reset_short_user" });

        const res = await request(app).post("/api/reset-password").send({
            username: user.username,
            newPassword: "short1",
            confirmPassword: "short1",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Password must be at least 8 characters");
    });

    test("returns 400 when password exceeds bcrypt safe length", async () => {
        const user = await createAuthUser({ username: "reset_long_user" });
        const tooLongPassword = "a".repeat(73);

        const res = await request(app).post("/api/reset-password").send({
            username: user.username,
            newPassword: tooLongPassword,
            confirmPassword: tooLongPassword,
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Password must be 72 characters or fewer");
    });

    test("returns 400 when new password matches current password", async () => {
        const user = await createAuthUser({ username: "reset_same_password_user" });

        const res = await request(app).post("/api/reset-password").send({
            username: user.username,
            newPassword: "password123",
            confirmPassword: "password123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("New password must be different from current password");
    });

    test("returns 404 when username does not exist", async () => {
        const res = await request(app).post("/api/reset-password").send({
            username: "does_not_exist_user",
            newPassword: "newpassword123",
            confirmPassword: "newpassword123",
        });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Username not found");
    });
});



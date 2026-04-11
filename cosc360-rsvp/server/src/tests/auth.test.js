import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";
import bcrypt from "bcryptjs";

describe("Auth/Register", () => {

    test("register a new user successfully", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .field("firstName", "Test")
            .field("lastName", "User")
            .field("username", "testuser_unique")
            .field("email", "testuser_unique@mail.com")
            .field("password", "password123")
            .attach("profilePhoto", Buffer.from("fake image data"), "profile.jpg");

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
        const res = await request(app)
            .post("/api/users/register")
            .field("firstName", "Existing")
            .field("lastName", "User")
            .field("username", "takenuser")
            .field("email", "takenuser2@mail.com")
            .field("password", "password123")
            .attach("profilePhoto", Buffer.from("fake image data"), "profile.jpg");

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username is already taken");
    });

    test("returns 400 if required fields are missing", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .field("username", "nopassword");

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("All fields are required");
    });

    test("returns 400 (not 500) when register body is missing with non-multipart payload", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .set("Content-Type", "application/json")
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("All fields are required");
    });

    test("returns 400 when profile photo is missing", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .field("firstName", "No")
            .field("lastName", "Photo")
            .field("username", "nophoto_user")
            .field("email", "nophoto@mail.com")
            .field("password", "password123");

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Profile image is required");
    });

    test("returns 400 when email format is invalid", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .field("firstName", "Invalid")
            .field("lastName", "Email")
            .field("username", "invalid_email_user")
            .field("email", "not-an-email")
            .field("password", "password123")
            .attach("profilePhoto", Buffer.from("fake image data"), "profile.jpg");

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid email format");
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

        const res = await request(app).post("/api/users/reset-password").send({
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

    test("returns 404 when required reset fields are empty", async () => {
        const res = await request(app).post("/api/users/reset-password").send({
            username: "",
            newPassword: "",
            confirmPassword: "",
        });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Username not found");
    });

    test("returns 400 when reset payload field types do not match", async () => {
        const res = await request(app).post("/api/users/reset-password").send({
            username: 123,
            newPassword: ["password123"],
            confirmPassword: { value: "password123" },
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Passwords don't match");
    });

    test("returns 400 when passwords do not match", async () => {
        const user = await createAuthUser({ username: "reset_mismatch_user" });

        const res = await request(app).post("/api/users/reset-password").send({
            username: user.username,
            newPassword: "newpassword123",
            confirmPassword: "differentpassword123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Passwords don't match");
    });

    test("allows reset when password is short under current rules", async () => {
        const user = await createAuthUser({ username: "reset_short_user" });

        const res = await request(app).post("/api/users/reset-password").send({
            username: user.username,
            newPassword: "short1",
            confirmPassword: "short1",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test("allows reset when password exceeds 72 characters under current rules", async () => {
        const user = await createAuthUser({ username: "reset_long_user" });
        const tooLongPassword = "a".repeat(73);

        const res = await request(app).post("/api/users/reset-password").send({
            username: user.username,
            newPassword: tooLongPassword,
            confirmPassword: tooLongPassword,
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test("allows reset when new password matches current password", async () => {
        const user = await createAuthUser({ username: "reset_same_password_user" });

        const res = await request(app).post("/api/users/reset-password").send({
            username: user.username,
            newPassword: "password123",
            confirmPassword: "password123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test("returns 404 when username does not exist", async () => {
        const res = await request(app).post("/api/users/reset-password").send({
            username: "does_not_exist_user",
            newPassword: "newpassword123",
            confirmPassword: "newpassword123",
        });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Username not found");
    });
});



import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";
import bcrypt from "bcryptjs";

async function createUser(overrides = {}) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    return await UserSchema.create({
        firstName: "Test",
        lastName: "User",
        username: `activation_user_${Date.now()}_${Math.random()}`,
        password: hashedPassword,
        role: "user",
        isActivated: true,
        createdDate: new Date(),
        ...overrides,
    });
}

async function createAdmin(overrides = {}) {
    return await createUser({
        role: "admin",
        username: `activation_admin_${Date.now()}_${Math.random()}`,
        ...overrides,
    });
}

describe("Unit: activation toggle logic", () => {
    test("toggles activated to deactivated", () => {
        const isActivated = true;
        const nextState = !isActivated;
        expect(nextState).toBe(false);
    });

    test("toggles deactivated to activated", () => {
        const isActivated = false;
        const nextState = !isActivated;
        expect(nextState).toBe(true);
    });
});

describe("Integration for PATCH /api/admin/:id/activation", () => {
    test("admin can deactivate an activated user", async () => {
        const admin = await createAdmin();
        const user = await createUser({ isActivated: true });

        const res = await request(app)
            .patch(`/api/admin/${user._id}/activation`)
            .set("x-user-id", admin._id.toString())
            .send({ isActivated: false });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.isActivated).toBe(false);

        const updated = await UserSchema.findById(user._id);
        expect(updated.isActivated).toBe(false);
    });

    test("admin can reactivate a deactivated user", async () => {
        const admin = await createAdmin();
        const user = await createUser({ isActivated: false });

        const res = await request(app)
            .patch(`/api/admin/${user._id}/activation`)
            .set("x-user-id", admin._id.toString())
            .send({ isActivated: true });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.isActivated).toBe(true);

        const updated = await UserSchema.findById(user._id);
        expect(updated.isActivated).toBe(true);
    });

    test("returns 403 for non-admin user", async () => {
        const user = await createUser();
        const target = await createUser();

        const res = await request(app)
            .patch(`/api/admin/${target._id}/activation`)
            .set("x-user-id", user._id.toString())
            .send({ isActivated: false });

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Forbidden");
    });

    test("returns 400 when activation value is missing", async () => {
        const admin = await createAdmin();
        const target = await createUser();

        const res = await request(app)
            .patch(`/api/admin/${target._id}/activation`)
            .set("x-user-id", admin._id.toString())
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing activation value");
    });

    test("returns 400 when activation value is invalid type", async () => {
        const admin = await createAdmin();
        const target = await createUser();

        const res = await request(app)
            .patch(`/api/admin/${target._id}/activation`)
            .set("x-user-id", admin._id.toString())
            .send({ isActivated: "false" });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid activation value");
    });

    test("returns 400 when admin tries to deactivate their own account", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .patch(`/api/admin/${admin._id}/activation`)
            .set("x-user-id", admin._id.toString())
            .send({ isActivated: false });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Admin cannot deactivate their own account");
    });

    test("returns 404 when user does not exist", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .patch("/api/admin/000000000000000000000001/activation")
            .set("x-user-id", admin._id.toString())
            .send({ isActivated: false });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });
});

describe("Integration for deactivated user access", () => {
    test("deactivated user cannot access protected profile endpoint", async () => {
        const user = await createUser({ isActivated: false });

        const res = await request(app)
            .get("/api/users/profile")
            .set("x-user-id", user._id.toString());

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Account is deactivated");
    });

    test("deactivated user cannot login", async () => {
        const user = await createUser({ isActivated: false });

        const res = await request(app)
            .post("/api/users/login")
            .send({ username: user.username, password: "password123" });

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Account is deactivated");
    });
});

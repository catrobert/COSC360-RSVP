import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";
import bcrypt from "bcryptjs";


//Setup function to create test users

async function createUser(overrides = {}){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);
    return await UserSchema.create({
        firstName: "Test",
        lastName: "User",
        username: `testuser_${Date.now()}`,
        password: hashedPassword,
        role:"user",
        createdDate: new Date(),
        ...overrides,
    });
}

async function createAdmin(overrides = {}){
    return await createUser({role: "admin", username:`admin_${Date.now()}`, ...overrides});
}

//Unit tests

describe("Unit: role toggle logic", () => {
    test("toggles admin to user", () => {
        const currentRole = "admin";
        const newRole = currentRole === "admin" ? "user" :"admin";
        expect(newRole).toBe("user");
    });
});

//Integration Tests for GET users
describe("Integration for GET /api/admin", () => {
    test("returns all users for admin", async() =>{
        const admin = await createAdmin();
        await createUser();
        await createUser();

        const res = await request(app)
            .get("/api/admin")
            .set("x-user-id", admin._id.toString());

        expect(res.statusCode).toBe(200);
        expect(res.body.users).toBeDefined();
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users.length).toBeGreaterThanOrEqual(2);    
    });

    test("returns 403 for non-admin user", async() => {
        const user = await createUser();

        const res = await request(app)
            .get("/api/admin")
            .set("x-user-id", user._id.toString());
        
        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Forbidden");    
    });
});

//Integration Test for DELETE users

describe("Integration for DELETE /api/users/:id", () => {
    test("admin can delete a user", async() =>{
        const admin = await createAdmin();
        const user = await createUser();

        const res = await request(app)
            .delete(`/api/admin/${user._id}`)
            .set("x-user-id", admin._id.toString());
        
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User deleted successfully");
        
        const deleted = await UserSchema.findById(user._id);
        expect(deleted).toBeNull();
    });

    test("returns 403 if non-admin tries to delete", async () => {
        const user = await createUser();
        const testUser = await createUser();

        const res = await request(app)
            .delete(`/api/admin/${testUser._id}`)
            .set("x-user-id", user._id.toString());

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Forbidden");
    });

    test("returns 404 if user does not exist", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .delete(`/api/admin/000000000000000000000001`)
            .set("x-user-id", admin._id.toString());

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });
});

//Integration Test for PUT /api/users/:id/role

describe("Integration for PUT /api/admin/:id/role", () => {
    test("admin can promote a user to admin", async() => {
        const admin = await createAdmin();
        const user = await createUser();

        const res = await request(app)
            .put(`/api/admin/${user._id}/role`)
            .set("x-user-id", admin._id.toString())
            .send({ role: "admin"});

        expect(res.statusCode).toBe(200);
        expect(res.body.user.role).toBe("admin");

        const updated = await UserSchema.findById(user._id);
        expect(updated.role).toBe("admin");
    });

    test("admin can demote an admin to a user", async () => {
        const admin = await createAdmin();
        const testAdmin = await createAdmin();

        const res = await request(app)
            .put(`/api/admin/${testAdmin._id}/role`)
            .set("x-user-id", admin._id.toString())
            .send({ role : "user"});

        expect(res.statusCode).toBe(200);
        expect(res.body.user.role).toBe("user");

        const updated = await UserSchema.findById(testAdmin._id);
        expect(updated.role).toBe("user");
    });

    test("returns 403 if non-admin tries to update role", async () => {
        const user = await createUser();
        const testUser = await createUser();

        const res = await request(app)
            .put(`/api/admin/${testUser._id}/role`)
            .set("x-user-id", user._id.toString())
            .send({ role : "admin" });

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("Forbidden");
    });

    test("returns 400 if role is missing", async () => {
        const admin = await createAdmin();
        const user = await createUser();

        const res = await request(app)
            .put(`/api/admin/${user._id}/role`)
            .set("x-user-id", admin._id.toString())
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Missing role");
    });

    test("returns 404 if user does not exist", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .put(`/api/admin/000000000000000000000001/role`)
            .set("x-user-id", admin._id.toString())
            .send({ role: "admin"});

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("User not found");
    });
    
});
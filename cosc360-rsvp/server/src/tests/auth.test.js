import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";
import bcrypt from "bcryptjs";

describe("Auth/Register", () => {
    
    test("register a new user successfully", async() => {
        const res = await request(app).post("/api/register").send({
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
            role:"user",
            createdDate: new Date(),
        })

        //try to register with same username
        const res = await request(app).post("/api/register").send({
            firstName: "Existing",
            lastName: "User",
            username: "takenuser",
            password: "password123"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Username is already taken");
    });

    test("returns 500 if required fields are missing", async () => {
        const res = await request(app).post("/api/register").send({
            username: "nopassword",
        });

        expect(res.statusCode).toBe(500);
    });
});

    

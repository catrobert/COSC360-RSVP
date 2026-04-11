import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";
import { EventModel } from "../modules/model/event.model.js";
import { RSVPModel } from "../modules/model/rsvp.model.js";
import bcrypt from "bcryptjs";

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

async function createEvent({ createdBy, date, endTime = "18:00", price = 0, attendance = 0, reviews = [] }) {
    return await EventModel.create({
        name: "Review Test Event",
        date,
        location: "Kelowna",
        startTime: "16:00",
        endTime,
        attendance,
        createdBy,
        price,
        description: "Review flow test",
        reviews,
    });
}

// tests for accessing the admin endpoint
describe("Access control for GET /api/admin/analytics", () => {
    test("returns 403 for non-admin user", async () => {
        const user = await createUser();

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", user._id.toString());

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("You are not permitted to view this page");
    });

    test("returns 200 and analytics object for admin", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", admin._id.toString());

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    });
});


// testing for the shape of the response
describe("Response shape for GET /api/admin/analytics", () => {
    test("returns all top-level analytics keys", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", admin._id.toString());

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("overview");
        expect(res.body).toHaveProperty("eventInsights");
        expect(res.body).toHaveProperty("revenueInsights");
        expect(res.body).toHaveProperty("ratingsInsights");
        expect(res.body).toHaveProperty("userInsights");
    });

    test("overview contains expected fields", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", admin._id.toString());

        const { overview } = res.body;
        expect(overview).toHaveProperty("totalEvents");
        expect(overview).toHaveProperty("totalAttendance");
        expect(overview).toHaveProperty("totalUpcoming");
        expect(overview).toHaveProperty("totalPast");
        expect(overview).toHaveProperty("totalUsers");
    });

    test("revenueInsights contains histogram with 4 quarters", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", admin._id.toString());

        const { histogram } = res.body.revenueInsights;
        expect(Array.isArray(histogram)).toBe(true);
        expect(histogram).toHaveLength(4);
        expect(histogram.map(h => h.quarter)).toEqual(["Q1", "Q2", "Q3", "Q4"]);
    });

    test("ratingsInsights contains ratingDistribution with 5 entries", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", admin._id.toString());

        const { ratingDistribution } = res.body.ratingsInsights;
        expect(Array.isArray(ratingDistribution)).toBe(true);
        expect(ratingDistribution).toHaveLength(5);
        expect(ratingDistribution.map(r => r.rating)).toEqual([1, 2, 3, 4, 5]);
    });
});

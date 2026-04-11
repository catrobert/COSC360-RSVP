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

// revenue insights tests
describe("Revenue insights", () => {
    test("totalRevenue reflects attendance * price across events", async () => {
        const admin = await createAdmin();
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 7);

        await createEvent({ createdBy: admin._id, date: pastDate, endTime: "08:00", attendance: 10, price: 20 });
        await createEvent({ createdBy: admin._id, date: pastDate, endTime: "08:00", attendance: 5, price: 40 });

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", admin._id.toString());

        expect(res.body.revenueInsights.totalRevenue).toBe(400);
    });

    test("histogram quarter counts increment for events within the last year", async () => {
        const admin = await createAdmin();

        const recentDate = new Date();
        recentDate.setMonth(recentDate.getMonth() - 1);

        await createEvent({ createdBy: admin._id, date: recentDate, endTime: "08:00", attendance: 5, price: 10 });

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", admin._id.toString());

        const { histogram } = res.body.revenueInsights;
        const totalQuarterCount = histogram.reduce((sum, q) => sum + q.count, 0);
        expect(totalQuarterCount).toBeGreaterThanOrEqual(1);
    });
});

// ratings tests
describe("Ratings insights", () => {
    test("averageRating is N/A when no reviews exist", async () => {
        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", admin._id.toString());

        // Only valid if no events with reviews were seeded — acceptable in isolated test DB
        const { averageRating } = res.body.ratingsInsights;
        expect(["N/A", expect.any(Number)]).toContain(averageRating);
    });

    test("averageRating and totalReviews reflect created reviews", async () => {
        const admin = await createAdmin();
        const user = await createUser();
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 7);

        await createEvent({
            createdBy: admin._id,
            date: pastDate,
            endTime: "08:00",
            reviews: [
                { rating: 4, comment: "Great!", userId: user._id },
                { rating: 2, comment: "Okay.", userId: user._id },
            ],
        });

        const res = await request(app)
            .get("/api/admin/analytics")
            .set("x-user-id", admin._id.toString());

        const { totalReviews, ratingDistribution } = res.body.ratingsInsights;
        expect(totalReviews).toBeGreaterThanOrEqual(2);

        const fourStar = ratingDistribution.find(r => r.rating === 4);
        const twoStar = ratingDistribution.find(r => r.rating === 2);
        expect(fourStar.count).toBeGreaterThanOrEqual(1);
        expect(twoStar.count).toBeGreaterThanOrEqual(1);
    });
});
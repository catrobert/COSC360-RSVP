import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";
import { RSVPModel } from "../modules/model/rsvp.model.js";
import { EventModel } from "../modules/model/event.model.js";
import bcrypt from "bcryptjs";

//SetUps

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

async function createEvent(userId, overrides = {}) {
    return await EventModel.create({
        name: "Test Event",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: "Test Location",
        startTime: "10:00",
        endTime: "12:00",
        attendance: 0,
        createdBy: userId,
        price: 10,
        description: "Test description",
        review: [],
        ...overrides,
    });
}

async function createRSVP(userId, eventId, status = "yes") {
    return await RSVPModel.create({ userId, eventId, status });
}

//Unit Test: validateStatus

describe("Unit for RSVP status validation", () => {
    const VALID_STATUSES = new Set(["yes", "no", "saved"]);

    test("accepts valid status 'yes'", () => {
        expect(VALID_STATUSES.has("yes")).toBe(true);
    });

    test("accepts valid status 'no'", () => {
        expect(VALID_STATUSES.has("no")).toBe(true);
    });

    test("accepts valid status 'saved'", () => {
        expect(VALID_STATUSES.has("saved")).toBe(true);
    });

    test("rejects invalid status", () => {
        expect(VALID_STATUSES.has("maybe")).toBe(false);
    });

    test("rejects empty status", () => {
        expect(VALID_STATUSES.has("")).toBe(false);
    });



});

//Integration Test for POST /api/rsvp

describe("Intergation for POST /api/rsvp (createRSVP)", () => {
    test("creates a new RSVP successfully", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);

        const res = await request(app)
            .post("/api/rsvp")
            .set("x-user-id", user._id.toString())
            .send({ eventId: event._id.toString(), status: "yes" });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("RSVP created successfully!");

    });

    test("returns 400 if user already rsvp'd yes", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);
        await createRSVP(user._id, event._id, "yes");

        const res = await request(app)
            .post("/api/rsvp")
            .set("x-user-id", user._id.toString())
            .send({ eventId: event._id.toString(), status: "yes" });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("You have already RSVP'd to this event!");
    });

    test("returns 500 if status is invalid", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);
        await createRSVP(user._id, event._id, "yes");

        const res = await request(app)
            .post("/api/rsvp")
            .set("x-user-id", user._id.toString())
            .send({ eventId: event._id.toString(), status: "maybe" });

        expect(res.statusCode).toBe(500);
    });
});

//Integration Tests for PUT /api/rsvp/:eventId

describe("Integration for PUT /api/rsvp/:eventId (updateRSVP)", () => {
    test("updates an existing RSVP status", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);
        await createRSVP(user._id, event._id, "yes");

        const res = await request(app)
            .put(`/api/rsvp/${event._id}`)
            .set("x-user-id", user._id.toString())
            .send({ status: "no" });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("RSVP updated successfully!");
        expect(res.body.event.status).toBe("no");
    });

    test("returns 404 if RSVP does not exist", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);

        const res = await request(app)
            .put(`/api/rsvp/${event._id}`)
            .set("x-user-id", user._id.toString())
            .send({ status: "no" });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("RSVP not found");

    });

    test("returns 400 if status is invalid", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);
        await createRSVP(user._id, event._id, "yes");

        const res = await request(app)
            .put(`/api/rsvp/${event._id}`)
            .set("x-user-id", user._id.toString())
            .send({ status: "maybe" });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid RSVP status");
    });

    test("returns 401 if no user id provided", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);

        const res = await request(app)
            .put(`/api/rsvp/${event._id}`)
            .send({ status: "no" });

        expect(res.statusCode).toBe(401);
    });

    test("returns 401 if user id does not map to an active user", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);

        const res = await request(app)
            .put(`/api/rsvp/${event._id}`)
            .set("x-user-id", "507f1f77bcf86cd799439011")
            .send({ status: "no" });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("User not authenticated");
    });
});

//Integration test for GET /api/rsvp/events

describe("Integration for GET /api/rsvp/events (getRSVPsByStatus", () => {
    test("returns RSVP status for a user and event", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);
        await createRSVP(user._id, event._id, "yes");

        const res = await request(app)
            .get(`/api/rsvp/events/${event._id}`)
            .set("x-user-id", user._id.toString());

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].status).toBe("yes");
    });

    test("returns empty array if no RSVP exists", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);

        const res = await request(app)
            .get(`/api/rsvp/events/${event._id}`)
            .set("x-user-id", user._id.toString());

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    test("returns 401 if user id does not map to an active user", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);

        const res = await request(app)
            .get(`/api/rsvp/events/${event._id}`)
            .set("x-user-id", "507f1f77bcf86cd799439011");

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe("User not authenticated");
    });
});

//Integration Test for PATCH /api/rsvp/:eventId (decline RSVP)

describe("Integration for PATCH /api/rsvp/:eventId (declineRSVP)", () => {
    test("successfully declines a yes RSVP", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);
        await createRSVP(user._id, event._id, "yes");

        const res = await request(app)
            .patch(`/api/rsvp/${event._id}`)
            .set("x-user-id", user._id.toString());

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("RSVP was successfully cancelled!");
        expect(res.body.event.status).toBe("no");
    });

    test("returns 404 if no RSVP exists to decline", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);

        const res = await request(app)
            .patch(`/api/rsvp/${event._id}`)
            .set("x-user-id", user._id.toString());

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("You have not RSVP'd to this event, so there is no RSVP to cancel");
    });

    test("returns 403 if RSVP status is not yes", async () => {
        const user = await createUser();
        const event = await createEvent(user._id);
        await createRSVP(user._id, event._id, "saved");

        const res = await request(app)
            .patch(`/api/rsvp/${event._id}`)
            .set("x-user-id", user._id.toString());

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("You have not RSVP'd 'yes' to this event, so there is no RSVP to cancel");
    });
});

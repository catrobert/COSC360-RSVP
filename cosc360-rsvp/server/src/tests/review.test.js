import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";
import { EventModel } from "../modules/model/event.model.js";
import { RSVPModel } from "../modules/model/rsvp.model.js";

let uniqueCounter = 0;

async function createUser(overrides = {}) {
    uniqueCounter += 1;

    return await UserSchema.create({
        firstName: "Test",
        lastName: "User",
        username: `review_user_${uniqueCounter}`,
        password: "password123",
        createdDate: new Date(),
        role: "user",
        ...overrides,
    });
}

async function createEvent({ createdBy, date, endTime = "18:00", reviews = [] }) {
    return await EventModel.create({
        name: "Review Test Event",
        date,
        location: "Kelowna",
        startTime: "16:00",
        endTime,
        attendance: 0,
        createdBy,
        price: 0,
        description: "Review flow test",
        reviews,
    });
}

describe("Reviews", () => {
    test("returns averageRating for an event with reviews", async () => {
        const host = await createUser({ username: "review_host_avg" });
        const reviewer1 = await createUser({ username: "reviewer_avg_1" });
        const reviewer2 = await createUser({ username: "reviewer_avg_2" });

        const event = await createEvent({
            createdBy: host._id,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            reviews: [
                { userId: reviewer1._id, rating: 5, comment: "Great" },
                { userId: reviewer2._id, rating: 3, comment: "Okay" },
            ],
        });

        const res = await request(app).get(`/api/events/${event._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.averageRating).toBeCloseTo(4, 5);
    });

    test("returns null averageRating when event has no reviews", async () => {
        const host = await createUser({ username: "review_host_empty" });
        const event = await createEvent({
            createdBy: host._id,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            reviews: [],
        });

        const res = await request(app).get(`/api/events/${event._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.averageRating).toBeNull();
    });

    test("rejects review creation when user did not RSVP yes", async () => {
        const host = await createUser({ username: "review_host_no_rsvp" });
        const reviewer = await createUser({ username: "reviewer_no_rsvp" });
        const event = await createEvent({
            createdBy: host._id,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        });

        const res = await request(app)
            .post(`/api/events/review/${event._id}`)
            .set("x-user-id", reviewer._id.toString())
            .send({ rating: 4, comment: "Attempt without RSVP" });

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("You must RSVP yes before reviewing this event!");
    });

    test("rejects review creation when event has not passed", async () => {
        const host = await createUser({ username: "review_host_upcoming" });
        const reviewer = await createUser({ username: "reviewer_upcoming" });
        const event = await createEvent({
            createdBy: host._id,
            date: new Date(Date.now() + 24 * 60 * 60 * 1000),
            endTime: "23:59",
        });

        await RSVPModel.create({
            eventId: event._id,
            userId: reviewer._id,
            status: "yes",
        });

        const res = await request(app)
            .post(`/api/events/review/${event._id}`)
            .set("x-user-id", reviewer._id.toString())
            .send({ rating: 5, comment: "Too early" });

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("You can only review events that have ended!");
    });

    test("creates review when user RSVP'd yes and event has passed", async () => {
        const host = await createUser({ username: "review_host_success" });
        const reviewer = await createUser({ username: "reviewer_success" });
        const event = await createEvent({
            createdBy: host._id,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            endTime: "20:00",
        });

        await RSVPModel.create({
            eventId: event._id,
            userId: reviewer._id,
            status: "yes",
        });

        const res = await request(app)
            .post(`/api/events/review/${event._id}`)
            .set("x-user-id", reviewer._id.toString())
            .send({ rating: 5, comment: "Excellent event" });

        expect(res.statusCode).toBe(201);
        expect(res.body.review).toBeTruthy();

        const updatedEvent = await EventModel.findById(event._id);
        expect(updatedEvent.reviews).toHaveLength(1);
        expect(updatedEvent.reviews[0].rating).toBe(5);
        expect(updatedEvent.averageRating).toBe(5);
    });

    test("rejects review creation when RSVP exists but is not yes", async () => {
        const host = await createUser({ username: "review_host_saved" });
        const reviewer = await createUser({ username: "reviewer_saved" });
        const event = await createEvent({
            createdBy: host._id,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        });

        await RSVPModel.create({
            eventId: event._id,
            userId: reviewer._id,
            status: "saved",
        });

        const res = await request(app)
            .post(`/api/events/review/${event._id}`)
            .set("x-user-id", reviewer._id.toString())
            .send({ rating: 2, comment: "Should not be allowed" });

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe("You must RSVP yes before reviewing this event!");
    });
});

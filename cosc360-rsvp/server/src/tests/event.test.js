import request from "supertest";
import app from "../index.js";
import { UserSchema } from "../modules/model/user.model.js";

let uniqueCounter = 0;

async function createUser(overrides = {}) {
    uniqueCounter += 1;

    return await UserSchema.create({
        firstName: "Event",
        lastName: "Tester",
        username: `event_user_${uniqueCounter}`,
        password: "password123",
        createdDate: new Date(),
        role: "user",
        ...overrides,
    });
}

function buildEventPayload(overrides = {}) {
    return {
        name: "Integration Test Event",
        date: new Date("2030-06-15").toISOString(),
        location: "Kelowna",
        startTime: "18:00",
        endTime: "20:00",
        price: 15.5,
        description: "Event endpoint integration test payload",
        ...overrides,
    };
}

async function createEventThroughApi(userId, overrides = {}) {
    return await request(app)
        .post("/api/events")
        .set("x-user-id", userId.toString())
        .send(buildEventPayload(overrides));
}

describe("Events", () => {
    describe("POST /api/events", () => {
        // tests auth guard path, request should stop when user header is missing
        test("returns 401 when user header is missing", async () => {
            const res = await request(app).post("/api/events").send(buildEventPayload());

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe("Missing user ID header");
        });

        // tests happy path, create works and default fields are set
        test("creates an event for authenticated users", async () => {
            const user = await createUser();
            const payload = buildEventPayload();

            const res = await request(app)
                .post("/api/events")
                .set("x-user-id", user._id.toString())
                .send(payload);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Event created successfully!");
            expect(res.body.event).toBeTruthy();
            expect(res.body.event.name).toBe(payload.name);
            expect(res.body.event.location).toBe(payload.location);
            expect(res.body.event.createdBy.toString()).toBe(user._id.toString());
            expect(res.body.event.attendance).toBe(0);
            expect(res.body.event.reviews).toHaveLength(0);
        });

        // creation should fail if payload is missing required fields
        test("returns 500 when required fields are missing", async () => {
            const user = await createUser({ username: "event_create_missing_fields" });
            const res = await request(app)
                .post("/api/events")
                .set("x-user-id", user._id.toString())
                .send({ name: "Incomplete Event" });

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Could not create event");
        });
    });

    describe("GET /api/events and GET /api/events/:id", () => {
        // tests list behavior, newly created event should show in get-all
        test("returns created events from the listing endpoint", async () => {
            const user = await createUser({ username: "event_list_host" });

            await request(app)
                .post("/api/events")
                .set("x-user-id", user._id.toString())
                .send(buildEventPayload({ name: "Spring Mixer" }));

            const res = await request(app).get("/api/events");

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.some((event) => event.name === "Spring Mixer")).toBe(true);
        });

        // tests get-by-id happy path, should return the exact event
        test("returns a single event by id", async () => {
            const user = await createUser({ username: "event_by_id_host" });
            const createRes = await request(app)
                .post("/api/events")
                .set("x-user-id", user._id.toString())
                .send(buildEventPayload({ name: "By ID Event" }));

            const eventId = createRes.body.event._id;
            const res = await request(app).get(`/api/events/${eventId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body._id).toBe(eventId);
            expect(res.body.name).toBe("By ID Event");
        });

        // tests missing resource path, unknown id should return 404
        test("returns 404 when event id does not exist", async () => {
            const missingId = "507f1f77bcf86cd799439011";
            const res = await request(app).get(`/api/events/${missingId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("Event not found");
        });

        // tests search by name, query should only return matching events
        test("filters events by search query", async () => {
            const user = await createUser({ username: "event_search_host" });
            await createEventThroughApi(user._id, { name: "JavaScript Workshop" });
            await createEventThroughApi(user._id, { name: "Photography Meetup" });

            const res = await request(app).get("/api/events?q=javascript");

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toBe("JavaScript Workshop");
        });

        // tests search by description, query should match description text too
        test("filters events by description content", async () => {
            const user = await createUser({ username: "event_search_description_host" });
            await createEventThroughApi(user._id, {
                name: "Backend Night",
                description: "Deep dive into Express and MongoDB patterns",
            });
            await createEventThroughApi(user._id, {
                name: "Frontend Night",
                description: "Hands-on CSS and animation basics",
            });

            const res = await request(app).get("/api/events?q=express");

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toBe("Backend Night");
        });

        // tests case-insensitive search, uppercase query should still match
        test("search is case-insensitive", async () => {
            const user = await createUser({ username: "event_search_case_host" });
            await createEventThroughApi(user._id, { name: "Node Networking" });
            await createEventThroughApi(user._id, { name: "React Basics" });

            const res = await request(app).get("/api/events?q=NODE");

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toBe("Node Networking");
        });

        // tests empty-result search, unmatched query should return an empty array
        test("returns empty array for unmatched search", async () => {
            const user = await createUser({ username: "event_search_empty_host" });
            await createEventThroughApi(user._id, { name: "Campus Chess Club" });

            const res = await request(app).get("/api/events?q=volleyball");

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(0);
        });
    });

    describe("PUT /api/events/:id", () => {
        // tests update auth guard, should reject when user header is missing
        test("returns 401 when updating without auth header", async () => {
            const host = await createUser({ username: "event_update_noauth_host" });
            const createRes = await createEventThroughApi(host._id, { name: "Needs Auth" });

            const res = await request(app)
                .put(`/api/events/${createRes.body.event._id}`)
                .send(buildEventPayload({ name: "Updated Name" }));

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe("Missing user ID header");
        });

        // tests update permissions, non-creator should not be allowed to edit
        test("returns 403 when non-creator tries to update", async () => {
            const host = await createUser({ username: "event_update_host" });
            const stranger = await createUser({ username: "event_update_stranger" });
            const createRes = await createEventThroughApi(host._id, { name: "Host Event" });

            const res = await request(app)
                .put(`/api/events/${createRes.body.event._id}`)
                .set("x-user-id", stranger._id.toString())
                .send(buildEventPayload({ name: "Stranger Update Attempt" }));

            expect(res.statusCode).toBe(403);
            expect(res.body.error).toBe("You are not the creator of this event");
        });

        // tests update happy path, creator should be able to edit event details
        test("updates event when creator sends request", async () => {
            const host = await createUser({ username: "event_update_owner" });
            const createRes = await createEventThroughApi(host._id, { name: "Original Name" });
            const eventId = createRes.body.event._id;

            const res = await request(app)
                .put(`/api/events/${eventId}`)
                .set("x-user-id", host._id.toString())
                .send(buildEventPayload({ name: "Updated By Owner", price: 22 }));

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Event updated successfully!");
            expect(res.body.event.name).toBe("Updated By Owner");
            expect(res.body.event.price).toBe(22);
        });

        // tests admin override path, admin can edit someone else's event
        test("allows admin to update another user's event", async () => {
            const host = await createUser({ username: "event_update_admin_host" });
            const admin = await createUser({ username: "event_update_admin", role: "admin" });
            const createRes = await createEventThroughApi(host._id, { name: "Host Event For Admin" });

            const res = await request(app)
                .put(`/api/events/${createRes.body.event._id}`)
                .set("x-user-id", admin._id.toString())
                .send(buildEventPayload({ name: "Admin Updated Event" }));

            expect(res.statusCode).toBe(200);
            expect(res.body.event.name).toBe("Admin Updated Event");
        });

        // update should return 404 when event id exists in format but not in db
        test("returns 404 when event does not exist", async () => {
            const user = await createUser({ username: "event_update_not_found" });
            const missingId = "507f1f77bcf86cd799439011";

            const res = await request(app)
                .put(`/api/events/${missingId}`)
                .set("x-user-id", user._id.toString())
                .send(buildEventPayload({ name: "Missing Event Update" }));

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("Event not found");
        });

        // tests invalid-id error path, bad object id format returns 500 currently
        test("returns 500 when event id format is invalid", async () => {
            const user = await createUser({ username: "event_update_bad_id" });

            const res = await request(app)
                .put("/api/events/not-a-valid-object-id")
                .set("x-user-id", user._id.toString())
                .send(buildEventPayload({ name: "Bad Id Update" }));

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe("Could not update event");
        });
    });

    describe("DELETE /api/events/:id", () => {
        // tests delete auth guard, should reject requests without user header
        test("returns 401 when deleting without auth header", async () => {
            const user = await createUser({ username: "event_delete_noauth_host" });
            const createRes = await createEventThroughApi(user._id, { name: "Needs Delete Auth" });

            const res = await request(app).delete(`/api/events/${createRes.body.event._id}`);

            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBe("Missing user ID header");
        });

        // tests owner delete happy path, event is removed and no longer retrievable
        test("deletes an event successfully for owner", async () => {
            const user = await createUser({ username: "event_delete_owner" });
            const createRes = await createEventThroughApi(user._id, { name: "Delete Me" });
            const eventId = createRes.body.event._id;

            const deleteRes = await request(app)
                .delete(`/api/events/${eventId}`)
                .set("x-user-id", user._id.toString());

            expect(deleteRes.statusCode).toBe(200);
            expect(deleteRes.body.message).toBe("Event deleted successfully!");
            expect(deleteRes.body.event._id).toBe(eventId);

            const fetchRes = await request(app).get(`/api/events/${eventId}`);
            expect(fetchRes.statusCode).toBe(404);
        });

        // tests admin override path, admin can delete events created by other users
        test("allows admin to delete another user's event", async () => {
            const host = await createUser({ username: "event_delete_admin_host" });
            const admin = await createUser({ username: "event_delete_admin", role: "admin" });
            const createRes = await createEventThroughApi(host._id, { name: "Delete By Admin" });

            const res = await request(app)
                .delete(`/api/events/${createRes.body.event._id}`)
                .set("x-user-id", admin._id.toString());

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Event deleted successfully!");
        });

        // tests permission guard, non-owner non-admin cannot delete events
        test("returns 403 when non-owner non-admin tries to delete", async () => {
            const host = await createUser({ username: "event_delete_host_forbidden" });
            const stranger = await createUser({ username: "event_delete_stranger" });
            const createRes = await createEventThroughApi(host._id, { name: "Cannot Delete" });

            const res = await request(app)
                .delete(`/api/events/${createRes.body.event._id}`)
                .set("x-user-id", stranger._id.toString());

            expect(res.statusCode).toBe(403);
            expect(res.body.error).toBe("You are not allowed to delete this event");
        });

        // delete should return 404 when the event does not exist
        test("returns 404 when deleting a missing event", async () => {
            const user = await createUser({ username: "event_delete_missing" });
            const missingId = "507f1f77bcf86cd799439011";

            const res = await request(app)
                .delete(`/api/events/${missingId}`)
                .set("x-user-id", user._id.toString());

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("Event not found");
        });
    });
});

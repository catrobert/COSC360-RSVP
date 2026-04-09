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

async function createEvent(userId, overrides = {}){
    return await EventModel.create({
        name: "Test Event",
        date: new Date(Date.now()+ 7 * 24 * 60 * 60 * 1000),
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

async function createRSVP(userId, eventId, status = "yes"){
    return await RSVPModel.create({ userId, eventId, status});
}

//Unit Test: validateStatus

describe("Unit for RSVP status validation", () => {
    const VALID_STATUSES = new Set(["yes", "no", "saved"]);

    test("accepts valid status 'yes'", () => {
        expectCookies(VALID_STATUSES.has("yes")).toBe(true);
    });

    test("accepts valid status 'no'", () => {
        expectCookies(VALID_STATUSES.has("no")).toBe(true);
    });

    test("accepts valid status 'saved'", () => {
        expectCookies(VALID_STATUSES.has("saved")).toBe(true);
    });

    test("rejects invalid status", () => {
        expectCookies(VALID_STATUSES.has("maybe")).toBe(false);
    });

    
})
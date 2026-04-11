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
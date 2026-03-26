import mongoose from "mongoose";
import { EventModel } from "./modules/model/event.model.js";
import data from "./data/events.json" with { type: "json" };

// populate our events with our sample data and store it into the db. Let's keep this to show functionality
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await EventModel.deleteMany({});
  await EventModel.insertMany(data.events);
  await mongoose.disconnect();
}

seed().catch(console.error);
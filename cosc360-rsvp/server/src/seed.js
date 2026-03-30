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

// Only seeds if the events collection is empty — safe to call on every startup
export async function seedIfEmpty() {
  const count = await EventModel.countDocuments();
  if (count === 0) {
    await EventModel.insertMany(data.events);
    console.log(`Seeded ${data.events.length} events.`);
  }
}

// Allow running directly: node seed.js
if (process.argv[1].endsWith("seed.js")) {
  seed().catch(console.error);
}
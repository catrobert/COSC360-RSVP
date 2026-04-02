import mongoose from "mongoose";
import { EventModel } from "./modules/model/event.model.js";
import data from "./data/events.json" with { type: "json" };
import bcrypt from "bcryptjs";
import { UserSchema } from "./modules/model/user.model.js";
import users from "./data/users.json" with { type: "json"};

// populate our events with our sample data and store it into the db. Let's keep this to show functionality
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await EventModel.deleteMany({});
  await UserSchema.deleteMany({});

  await EventModel.insertMany(data.events);

  const hashedUsers = await Promise.all(
    users.users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  await UserSchema.insertMany(hashedUsers);

  console.log(`Seeded ${users.users.length} users.`);

  await mongoose.disconnect();
}

// Only seeds if the events collection is empty — safe to call on every startup
export async function seedIfEmpty() {
  const count = await EventModel.countDocuments();
  if (count === 0) {
    await EventModel.insertMany(data.events);
    console.log(`Seeded ${data.events.length} events.`);
  }

  const userCount = await UserSchema.countDocuments();
  if(userCount === 0){
    const hashedUsers = await Promise.all(
      users.users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await UserSchema.insertMany(hashedUsers);
    console.log(`Seeded ${users.users.length} users.`);
  }

}

// Allow running directly: node seed.js — uses seedIfEmpty so it never wipes existing data
if (process.argv[1].endsWith("seed.js")) {
  (async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await seedIfEmpty();
    await mongoose.disconnect();
  })().catch(console.error);
}
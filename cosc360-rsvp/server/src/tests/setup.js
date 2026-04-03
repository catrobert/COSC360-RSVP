import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongodb;

beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
        await mongoose.connect(uri);
});

afterEach(async () => {
    //wipes the mock DB between tests so they don't interfere
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongodb.stop();
})
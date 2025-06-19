import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../index.js"; 
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "test" });
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth Routes", () => {
  const testUser = {
    name: "Yadnyesh",
    email: "yadnyesh@example.com",
    password: "password123",
    role: "client"
  };

  it("should signup a new user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should not allow signup with existing email", async () => {
    await User.create({ ...testUser, password: "hashedpassword" });

    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already exists");
  });

  it("should login an existing user", async () => {
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    await User.create({ ...testUser, password: hashedPassword });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.message).toBe("Login successful");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should not login with wrong password", async () => {
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    await User.create({ ...testUser, password: hashedPassword });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should logout a user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/logout");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logout successful");
  });
});
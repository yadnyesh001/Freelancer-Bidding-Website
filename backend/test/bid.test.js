import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import app from "../index.js";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Bid from "../models/bid.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config({ path: ".env.test" });

let mongoServer;
let freelancerToken, clientToken;
let projectId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "test" });
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Bid Routes", () => {
  const freelancer = {
    name: "Freelancer",
    email: "freelancer@test.com",
    password: "password123",
    role: "freelancer",
  };

  const client = {
    name: "Client",
    email: "client@test.com",
    password: "password123",
    role: "client",
  };

  beforeEach(async () => {
    const hashedFreelancer = await bcrypt.hash(freelancer.password, 10);
    const freelancerDoc = await User.create({
      ...freelancer,
      password: hashedFreelancer,
    });

    const hashedClient = await bcrypt.hash(client.password, 10);
    const clientDoc = await User.create({ ...client, password: hashedClient });

    // Generate JWTs manually using your secret
    freelancerToken = jwt.sign(
      { id: freelancerDoc._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    clientToken = jwt.sign({ id: clientDoc._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const project = await Project.create({
      title: "Test Project",
      description: "Test Description",
      budget: 1000,
      deadline: new Date(),
      postedBy: clientDoc._id,
      category: "Web Development",
    });

    projectId = project._id;
  });

  it("should allow freelancer to place a bid", async () => {
    const res = await request(app)
      .post(`/api/v1/bid/${projectId}`)
      .set("Authorization", `Bearer ${freelancerToken}`)
      .send({
        amount: 500,
        description: "I can do this project",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Bid placed successfully");
  });

  it("should fetch all bids for a project by the client", async () => {
    const freelancerDoc = await User.findOne({ email: freelancer.email });
    await Bid.create({
      project: projectId,
      freelancer: freelancerDoc._id,
      amount: 500,
      description: "Sample Bid",
    });

    const res = await request(app)
      .get(`/api/v1/bid/project/${projectId}`)
      .set("Authorization", `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.bids.length).toBe(1);
  });

  it("should fetch freelancer's own bids", async () => {
    const freelancerDoc = await User.findOne({ email: freelancer.email });
    await Bid.create({
      project: projectId,
      freelancer: freelancerDoc._id,
      amount: 700,
      description: "Freelancer Bid",
    });

    const res = await request(app)
      .get(`/api/v1/bid/my`)
      .set("Authorization", `Bearer ${freelancerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.bids.length).toBe(1);
  });

  it("should update a bid", async () => {
    const freelancerDoc = await User.findOne({ email: freelancer.email });

    const bid = await Bid.create({
      project: projectId,
      freelancer: freelancerDoc._id, // ✅ very important
      amount: 400,
      description: "Old Bid",
    });

    const res = await request(app)
      .patch(`/api/v1/bid/${bid._id}`)
      .set("Authorization", `Bearer ${freelancerToken}`) // ✅ matches user above
      .send({
        amount: 800,
        description: "Updated Bid",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.bid.amount).toBe(800);
  });

  it("should delete a bid", async () => {
    const freelancerDoc = await User.findOne({ email: freelancer.email });
    const bid = await Bid.create({
      project: projectId,
      freelancer: freelancerDoc._id,
      amount: 450,
      description: "To Delete",
    });

    const res = await request(app)
      .delete(`/api/v1/bid/${bid._id}`)
      .set("Authorization", `Bearer ${freelancerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Bid deleted successfully");
  });

  it("should allow client to award a bid", async () => {
    const freelancerDoc = await User.findOne({ email: freelancer.email });
    const bid = await Bid.create({
      project: projectId,
      freelancer: freelancerDoc._id,
      amount: 999,
      description: "Award Me",
    });

    const res = await request(app)
      .post(`/api/v1/bid/award/${bid._id}`)
      .set("Authorization", `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.bid.status).toBe("accepted");
    expect(res.body.project.status).toBe("in-progress");
  });
});

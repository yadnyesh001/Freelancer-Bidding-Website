import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../index.js";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config({ path: ".env.test" });

let mongoServer;
let clientToken;
let freelancerToken;
let clientId;
let freelancerId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "test" });

  // Create client user
  const clientPassword = await bcrypt.hash("clientpass", 10);
  const client = await User.create({
    name: "Client User",
    email: "client@test.com",
    password: clientPassword,
    role: "client"
  });
  clientId = client._id;
  clientToken = jwt.sign({ id: client._id }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  // Create freelancer user
  const freelancerPassword = await bcrypt.hash("freelancerpass", 10);
  const freelancer = await User.create({
    name: "Freelancer User",
    email: "freelancer@test.com",
    password: freelancerPassword,
    role: "freelancer"
  });
  freelancerId = freelancer._id;
  freelancerToken = jwt.sign({ id: freelancer._id }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Project.deleteMany();
});

describe("Project Routes", () => {
  const testProject = {
    title: "Test Project",
    description: "This is a test project",
    category: "Web Development",
    budget: 1000,
    deadline: new Date(Date.now() + 86400000).toISOString(), // 1 day in future
  };

  it("should create a project as client", async () => {
    const res = await request(app)
      .post("/api/v1/project")
      .set("Authorization", `Bearer ${clientToken}`)
      .send(testProject);

    expect(res.statusCode).toBe(201);
    expect(res.body.project.title).toBe(testProject.title);
  });

  it("should not allow freelancer to create a project", async () => {
    const res = await request(app)
      .post("/api/v1/project")
      .set("Authorization", `Bearer ${freelancerToken}`)
      .send(testProject);

    expect(res.statusCode).toBe(403); // Access denied due to role
  });

  it("should not create project with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/project")
      .set("Authorization", `Bearer ${clientToken}`)
      .send({ title: "Incomplete" });

    expect(res.statusCode).toBe(400);
  });

  it("should fetch all projects", async () => {
    await Project.create({ ...testProject, postedBy: clientId });

    const res = await request(app)
      .get("/api/v1/project")
      .set("Authorization", `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch client’s own projects", async () => {
    await Project.create({ ...testProject, postedBy: clientId });

    const res = await request(app)
      .get("/api/v1/project/my-projects")
      .set("Authorization", `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].postedBy.email).toBe("client@test.com");
  });

  it("should fetch freelancer’s awarded projects (empty for now)", async () => {
    const res = await request(app)
      .get("/api/v1/project/my-awarded")
      .set("Authorization", `Bearer ${freelancerToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a project by ID", async () => {
    const project = await Project.create({ ...testProject, postedBy: clientId });

    const res = await request(app)
      .get(`/api/v1/project/${project._id}`)
      .set("Authorization", `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testProject.title);
  });

  it("should update a project", async () => {
    const project = await Project.create({ ...testProject, postedBy: clientId });

    const res = await request(app)
      .patch(`/api/v1/project/${project._id}`)
      .set("Authorization", `Bearer ${clientToken}`)
      .send({
        title: "Updated Title",
        description: "Updated Description",
        budget: 1200,
        deadline: new Date(Date.now() + 2 * 86400000).toISOString()
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.project.title).toBe("Updated Title");
  });

  it("should delete a project", async () => {
    const project = await Project.create({ ...testProject, postedBy: clientId });

    const res = await request(app)
      .delete(`/api/v1/project/${project._id}`)
      .set("Authorization", `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Project deleted successfully");
  });
});

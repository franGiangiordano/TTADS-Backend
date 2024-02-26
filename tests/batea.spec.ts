import request from "supertest";
import app from "../src/app";

describe("GET /batea", () => {
  it("should respond with 200", (done) => {
    request(app)
      .get("/api/batea")
      .set("Content-Type", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
  /*
  it("should respond with an object", async () => {
    const response = await request(app).get("/api/batea").send();
    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("POST /batea", () => {
  it("should respond with 201", async () => {
    const response = await request(app).post("/api/batea").send({
      patent: "ABC123",
    });
    expect(response.statusCode).toBe(201);
  });*/
});

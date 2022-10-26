import request from "supertest";
import express from "express";
import router from "../backend/routes/dataSourceRoute";

const app = new express();
app.use("/", router);

describe("Koel Bay Data Route", function () {
  test("responds to /koelbay", async () => {
    const res = await request(app).get("/koelbay");

    expect(res.statusCode).toBe(200);
  });
});

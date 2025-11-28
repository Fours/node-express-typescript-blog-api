const request = require("supertest");
const app = require('.');

afterAll((done) => {
    app.close(() => {
        done();
    });
});

describe("GET /does-not-exist", () => {
    it("should return a not found response", async () => {
        const res = await request(app).get("/does-not-exist");
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toBe("No endpoint found");
    });
});
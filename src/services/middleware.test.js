const request = require("supertest");
const app = require('../');

afterAll((done) => {
    app.close(() => {
        done();
    });
});

describe("validateId when id param is not a valid uuid", () => {
    it("should return a 'Bad Request' response", async () => {
        const res = await request(app).get("/api/articles/not-a-uuid");
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe("Article id must be a valid uuid");
    });
});

describe("validateId when id param is a valid uuid", () => {
    it("should invoke NextFunction which returns a 'Not Found' response", async () => {
        const res = await request(app).get("/api/articles/0720f1cd-f42c-4122-adb2-6a904298a3e9");
        expect(res.statusCode).toEqual(404);
    });
});

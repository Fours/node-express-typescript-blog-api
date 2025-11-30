const request = require("supertest");
const app = require('../');

afterAll((done) => {
    app.close(() => {
        done();
    });
});

describe("validateId", () => {

    describe("when id param is not a valid uuid", () => {
        it("should return a 'Bad Request' response", async () => {
            const res = await request(app).get("/api/articles/not-a-uuid");
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Article id must be a valid uuid");
        });
    });
})

describe("validatePost", () => {

    const article = {
        author: "author",
        tags: ["tag"],
        title: "title",
        blurb: "blurb",
        body: "body"
    }
    const message = "Article must include author: string, tags: string[], title: string, blurb: string, and body: string"
    
    describe("when 'author' is not a string", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle1 = {...article, author: undefined}
            const res1 = await request(app).post("/api/articles").send(invalidArticle1);
            expect(res1.statusCode).toBe(400);
            expect(res1.body.message).toBe(message);
            const invalidArticle2 = {...article, author: true}
            const res2 = await request(app).post("/api/articles").send(invalidArticle2);
            expect(res2.statusCode).toBe(400);
            expect(res2.body.message).toBe(message);
        });
    });

    describe("when 'tags' is not a string array", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle1 = {...article, tags: undefined}
            const res1 = await request(app).post("/api/articles").send(invalidArticle1);
            expect(res1.statusCode).toBe(400);
            expect(res1.body.message).toBe(message);
            const invalidArticle2 = {...article, tags: ["tag", true]}
            const res2 = await request(app).post("/api/articles").send(invalidArticle2);
            expect(res2.statusCode).toBe(400);
            expect(res2.body.message).toBe(message);
        });
    });

    describe("when 'title' is not a string", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle1 = {...article, title: undefined}
            const res1 = await request(app).post("/api/articles").send(invalidArticle1);
            expect(res1.statusCode).toBe(400);
            expect(res1.body.message).toBe(message);
            const invalidArticle2 = {...article, title: true}
            const res2 = await request(app).post("/api/articles").send(invalidArticle2);
            expect(res2.statusCode).toBe(400);
            expect(res2.body.message).toBe(message);
        });
    });

    describe("when 'blurb' is not a string", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle1 = {...article, blurb: undefined}
            const res1 = await request(app).post("/api/articles").send(invalidArticle1);
            expect(res1.statusCode).toBe(400);
            expect(res1.body.message).toBe(message);
            const invalidArticle2 = {...article, blurb: true}
            const res2 = await request(app).post("/api/articles").send(invalidArticle2);
            expect(res2.statusCode).toBe(400);
            expect(res2.body.message).toBe(message);
        });
    });

    describe("when 'body' is not a string", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle1 = {...article, body: undefined}
            const res1 = await request(app).post("/api/articles").send(invalidArticle1);
            expect(res1.statusCode).toBe(400);
            expect(res1.body.message).toBe(message);
            const invalidArticle2 = {...article, body: true}
            const res2 = await request(app).post("/api/articles").send(invalidArticle2);
            expect(res2.statusCode).toBe(400);
            expect(res2.body.message).toBe(message);
        });
    });
})

describe("validatePut", () => {

    const article = {
        id: "ef70595d-260e-459f-bdaa-66d97b880775",
        author: "author",
        tags: ["tag"],
        title: "title",
        blurb: "blurb",
        body: "body"
    }
    const message1 = "Article id must be present and be a valid uuid"
    const message2 = "Invalid article properties"

    describe("when 'id' is not a present", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle = {...article, id: undefined}
            const res = await request(app).put("/api/articles").send(invalidArticle);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(message1);
        });
    });

    describe("when 'id' is not a uuid", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle = {...article, id: "not-a-uuid"}
            const res = await request(app).put("/api/articles").send(invalidArticle);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(message1);
        });
    });

    describe("when 'author' is present and not a string", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle = {...article, author: true}
            const res = await request(app).put("/api/articles").send(invalidArticle);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(message2);
        });
    });

    describe("when 'tags' is present and not a string array", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle1 = {...article, author: true}
            const res1 = await request(app).put("/api/articles").send(invalidArticle1);
            expect(res1.statusCode).toBe(400);
            expect(res1.body.message).toBe(message2);
            const invalidArticle2 = {...article, author: ["tag", true]}
            const res2 = await request(app).put("/api/articles").send(invalidArticle2);
            expect(res2.statusCode).toBe(400);
            expect(res2.body.message).toBe(message2);
        });
    });

    describe("when 'title' is present and not a string", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle = {...article, title: true}
            const res = await request(app).put("/api/articles").send(invalidArticle);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(message2);
        });
    });
    
    describe("when 'blurb' is present and not a string", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle = {...article, blurb: true}
            const res = await request(app).put("/api/articles").send(invalidArticle);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(message2);
        });
    });

    describe("when 'body' is present and not a string", () => {
        it("should return a 'Bad Request' response", async () => {
            const invalidArticle = {...article, body: true}
            const res = await request(app).put("/api/articles").send(invalidArticle);
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(message2);
        });
    });
})



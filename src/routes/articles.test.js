const request = require("supertest");
const app = require("../");
import * as dataUtil from "../utils/data"

const testData = [
    {
        id: "ef70595d-260e-459f-bdaa-66d97b880775",
        timestamp: 1763670293754,
        author: "author 1",
        tags: ["tag 1"],
        title: "title 1",
        blurb: "blurb 1",
        body: "body 1"
    },
    {
        id: "dc4351e3-d12b-4018-a5dd-96eea6d788c4",
        timestamp: 1763670293754,
        author: "author 2",
        tags: ["tag 2"],
        title: "title 2",
        blurb: "blurb 2",
        body: "body 2"
    }
]

const notAnArticleId = "d2549eec-0490-41ba-a4fd-4e45ce96ef10"

beforeEach(() => {    
    dataUtil.writeData(testData)
})

afterAll((done) => {
    app.close(() => {
        done();
    });
});

describe("GET /api/articles", () => {
    
    describe("when articles exists", () => {
        it("should return articles with an 'Ok' response", async () => {
            
            const res = await request(app).get("/api/articles/");
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(testData)
        });
    });

    describe("when author query param is provided", () => {
        it("should return filtered articles with an 'Ok' response", async () => {
            
            const res = await request(app).get(`/api/articles/?author=${testData[1].author}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([testData[1]])
        });
    });

    describe("when tags query param is provided", () => {
        it("should return filtered articles with an 'Ok' response", async () => {
            
            const res1 = await request(app).get(`/api/articles/?tags=${testData[0].tags[0]}`);
            expect(res1.statusCode).toBe(200);
            expect(res1.body).toEqual([testData[0]])
            
            const res2 = await request(app).get(`/api/articles/?tags=${testData[0].tags[0]},${testData[1].tags[0]}`);
            expect(res2.statusCode).toBe(200);
            expect(res2.body).toEqual([])
        });
    });

    describe("when both author and tags query param is provided", () => {
        it("should return filtered articles with an 'Ok' response", async () => {
            
            const res1 = await request(app).get(`/api/articles/?tags=${testData[0].tags[0]}&author=${testData[1].author}`);
            expect(res1.statusCode).toBe(200);
            expect(res1.body).toEqual([])
        });
    });
})

describe("GET /api/articles/:id", () => {
    
    describe("when article exists", () => {
        it("should return the article with an 'Ok' response", async () => {
            
            const res = await request(app).get(`/api/articles/${testData[1].id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(testData[1]);
        });
    });

    describe("when articles does not exist", () => {
        it("should return a 'Not Found' response", async () => {
            
            const res = await request(app).get(`/api/articles/${notAnArticleId}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("No article found with that id");
        });
    });
})

describe("POST /api/articles", () => {

    const articlePayload = {
        author: "author 3",
        tags: ["tag 3"],
        title: "title 3",
        blurb: "blurb 3",
        body: "<p>body <b>3</b></p>"
    }

    describe("when new article is valid", () => {
        it("should save article and return a 'Created' response", async () => {
            
            const res = await request(app).post("/api/articles/").send(articlePayload);
            expect(res.statusCode).toBe(201);
            expect(typeof res.body.id).toBe("string");
            expect(res.body.id.length).toBe(36);
            expect(typeof res.body.timestamp).toBe("number");            
            const newArticle = {...articlePayload, id: res.body.id, timestamp: res.body.timestamp}
            expect(res.body).toEqual(newArticle)

            const updatedData = await dataUtil.readData()
            expect(updatedData).toEqual([...testData, newArticle])
        });
    });

    describe("when new article contains unallowed html", () => {
        it("should strip tags then save article and return a 'Created' response", async () => {
            
            const unallowedHtmlPayload = {
                author: "<script></script><p>author 3</p>",
                tags: ["<script></script><p>tag 3</p>"],
                title: "<script></script><p>title 3</p>",
                blurb: "<script></script><p>blurb 3</p>",
                body: "<script></script><p>body <b>3</b></p>"
            }
            
            const res = await request(app).post("/api/articles/").send(unallowedHtmlPayload);
            expect(res.statusCode).toBe(201);
            expect(typeof res.body.id).toBe("string");
            expect(res.body.id.length).toBe(36);
            expect(typeof res.body.timestamp).toBe("number");            
            const newArticle = {...articlePayload, id: res.body.id, timestamp: res.body.timestamp}
            expect(res.body).toEqual(newArticle)

            const updatedData = await dataUtil.readData()
            expect(updatedData).toEqual([...testData, newArticle])
        });
    });

})

describe("DELETE /api/articles/:id", () => {
    
    describe("when article exists", () => {
        it("should delete article and return an 'Ok' response", async () => {
            
            const res = await request(app).delete(`/api/articles/${testData[0].id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Article deleted");

            const updatedData = await dataUtil.readData()
            expect(updatedData).toEqual([testData[1]])
        });
    });

    describe("when article does not exist", () => {
        it("should return a 'Not Found' response", async () => {
            
            const res = await request(app).delete(`/api/articles/${notAnArticleId}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("No article found with that id");
        });
    });
})
const request = require("supertest");
const app = require("../");
import * as dataUtil from "../utils/data"

const testData = [
    {
        id: "ef70595d-260e-459f-bdaa-66d97b880775",
        timestamp: 1763670293754,
        author: "test author 1",
        tags: ["test tag 1"],
        blurb: "test blurb 1",
        body: "test body 1"
    },
    {
        id: "dc4351e3-d12b-4018-a5dd-96eea6d788c4",
        timestamp: 1763670293754,
        author: "test author 2",
        tags: ["test tag 2"],
        blurb: "test blurb 2",
        body: "test body 2"
    }
]

const notAnArticleId = "d2549eec-0490-41ba-a4fd-4e45ce96ef10"

let readDataSpy
let writeDataSpy

beforeAll((done) => {
    readDataSpy = jest.spyOn(dataUtil, 'readData').mockReturnValue(Promise.resolve(testData));
    writeDataSpy = jest.spyOn(dataUtil, 'writeData').mockReturnValue(Promise.resolve());
    done();
})

afterEach(() => {
  jest.clearAllMocks();
});

afterAll((done) => {
    jest.resetAllMocks()
    app.close(() => {
        done();
    });
});

describe("GET /api/articles", () => {
    
    describe("when articles exists", () => {
        it("should return articles with an 'Ok' response", async () => {
            
            const res = await request(app).get("/api/articles/");
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0].id).toBe(testData[0].id);
            expect(res.body[1].id).toBe(testData[1].id);

            expect(readDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy).toHaveBeenCalledTimes(0);
        });
    });
})

describe("GET /api/articles/:id", () => {
    
    describe("when article exists", () => {
        it("should return the article with an 'Ok' response", async () => {
            
            const res = await request(app).get(`/api/articles/${testData[1].id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.id).toBe(testData[1].id);
            expect(res.body.author).toBe(testData[1].author);

            expect(readDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe("when articles does not exist", () => {
        it("should return a 'Not Found' response", async () => {
            
            const res = await request(app).get(`/api/articles/${notAnArticleId}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe("No article found with that id");

            expect(readDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy).toHaveBeenCalledTimes(0);
        });
    });
})

describe("DELETE /api/articles/:id", () => {
    
    describe("when article exists", () => {
        it("should delete article and return an 'Ok' response", async () => {
            
            const res = await request(app).delete(`/api/articles/${testData[0].id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe("Article deleted");

            expect(readDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy.mock.calls[0][0].length).toBe(1)
            expect(writeDataSpy.mock.calls[0][0][0].id).toBe(testData[1].id)
        });
    });

    describe("when article does not exist", () => {
        it("should return a 'Not Found' response", async () => {
            
            const res = await request(app).delete(`/api/articles/${notAnArticleId}`);
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe("No article found with that id");

            expect(readDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy).toHaveBeenCalledTimes(0);
        });
    });

})
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
    }
]

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

describe("DELETE /api/article/:id", () => {
    
    describe("when article exists", () => {
        it("should delete article and return an 'Ok' response", async () => {
            
            const res = await request(app).delete(`/api/articles/${testData[0].id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe("Article deleted");

            expect(readDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy.mock.calls[0][0].length).toBe(0)
        });
    });

    describe("when article does not exist", () => {
        it("should return a 'Not Found' response", async () => {
            
            const res = await request(app).delete("/api/articles/dc4351e3-d12b-4018-a5dd-96eea6d788c4");
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe("No article found with that id");

            expect(readDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy).toHaveBeenCalledTimes(0);
        });
    });

})
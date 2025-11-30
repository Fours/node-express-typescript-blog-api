const request = require("supertest");
const app = require("../");
import * as dataUtil from "../utils/data"

const testData = [
    {
        author: "test author 1"
    },
    {
        author: "test author 2"
    },
    {
        author: "test author 1"
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

describe("GET /api/authors", () => {
    
    describe("when authors exist", () => {
        it("should return authors with an 'Ok' response", async () => {
            
            const res = await request(app).get("/api/authors");
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2);
            expect(res.body[0]).toBe(testData[0].author);
            expect(res.body[1]).toBe(testData[1].author);

            expect(readDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy).toHaveBeenCalledTimes(0);
        });
    });
})
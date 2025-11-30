const request = require("supertest");
const app = require("../");
import * as dataUtil from "../utils/data"

const testData = [
    {
        tags: ["test tag 1", "test tag 3"],
    },
    {
        tags: ["test tag 2", "test tag 3"],
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

describe("GET /api/tags", () => {
    
    describe("when tags exist", () => {
        it("should return tags with an 'Ok' response", async () => {
            
            const res = await request(app).get("/api/tags");
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(3);
            expect(res.body[0]).toBe(testData[0].tags[0]);
            expect(res.body[1]).toBe(testData[0].tags[1]);
            expect(res.body[2]).toBe(testData[1].tags[0]);

            expect(readDataSpy).toHaveBeenCalledTimes(1);
            expect(writeDataSpy).toHaveBeenCalledTimes(0);
        });
    });
})
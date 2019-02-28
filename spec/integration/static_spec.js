const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000';

describe("routes : static", () => {
  describe("GET /", () => {
    it("should return status code 200 and have 'Welcome to Bloccit' in the body of the response", () => {
      request.get(base, (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(body).toContain("Welcome to Bloccit");
      });
    });
  });
  describe("GET /marco", () => {
    it("should return status code 200", done => {
      request.get(base + "/marco", (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe('polo');
        done();
      });
    });
  });
});

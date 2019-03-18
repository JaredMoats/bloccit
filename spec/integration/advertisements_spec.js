const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {

  beforeEach(done => {
    this.advertisement;
    sequelize.sync({force: true}).then(response => {
      Advertisement.create({
        title: "React ad",
        description: "Here's my creative copy that convinces you to try React"
      })
      .then(advertisement => {
        this.advertisement = advertisement;
        done();
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
  });

  describe("GET /advertisements", () => {
    it("should return a status code 200 and all advertisements", done => {
      request.get(base, (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(error).toBeNull();
        expect(body).toContain("Advertisements");
        expect(body).toContain("React ad");
        done();
      });
    });
  });
});

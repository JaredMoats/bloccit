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
  describe("GET /advertisements/new", () => {
    it("should render a new advertisement form", done => {
      request.get(`${base}new`, (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("New Advertisement");
        done();
      });
    });
  });
  describe("POST /advertisements/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "React ad",
        description: "Here's my creative copy that convinces you to try React",
      }
    };

    it("should create a new advertisement and redirect", done => {
      request.post(options, (error, response, body) => {
        Advertisement.findOne({where: {title: "React ad"}})
        .then(advertisement => {
          expect(response.statusCode).toBe(303);
          expect(advertisement.title).toBe("React ad");
          expect(advertisement.description).toBe("Here's my creative copy that convinces you to try React");
          done();
        })
        .catch(error => {
          console.log(error);
          done();
        });
      })
    });

  });
  describe("GET /advertisements/:id", () => {
    it("should render a view with the selected advertisement", done => {
      request.get(`${base}${this.advertisement.id}`, (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("React ad");
        done();
      });
    });
  });
  describe("POST /advertisements/:id/destroy", () => {

     it("should delete the advertisement with the associated ID", (done) => {

 //#1
       Advertisement.all()
       .then((advertisements) => {

 //#2
         const advertisementCountBeforeDelete = advertisements.length;

         expect(advertisementCountBeforeDelete).toBe(1);

 //#3
         request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
           Advertisement.all()
           .then((advertisements) => {
             expect(err).toBeNull();
             expect(advertisements.length).toBe(advertisementCountBeforeDelete - 1);
             done();
           })
         });
       });
     });
   });
   describe("GET /advertisements/:id/edit", () => {
     it("should render a view with an edit advertisement form", done => {
       request.get(`${base}${this.advertisement.id}/edit`, (error, response, body) => {
         expect(error).toBeNull();
         expect(body).toContain("Edit Advertisement");
         expect(body).toContain("React ad");
         done();
       });
     });
   });
   describe("POST /advertisements/:id/update", () => {

     it("should update the advertisement with the given values", (done) => {
        const options = {
           url: `${base}${this.advertisement.id}/update`,
           form: {
             title: "React ad",
             description: "Here's my creative copy that convinces you to try React"
           }
         };
//#1
         request.post(options, (err, res, body) => {

           expect(err).toBeNull();
//#2
           Advertisement.findOne({
             where: { id: this.advertisement.id }
           })
           .then((advertisement) => {
             expect(advertisement.title).toBe("React ad");
             done();
           });
         });
     });

   });
});

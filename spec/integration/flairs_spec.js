const request = require("request");
const server = require("../../src/server");
const base = `http://localhost:3000/topics`;
const localhost = `http://localhost:3000`;

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("routes : flairs", () => {
  /* Create a topic, post, and flair for the following tests */
  beforeEach(done => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then(response => {
      Topic.create({
        title: "Do you want to test flairs?",
        description: "Post about your flair tests here"
      })
      .then(topic => {
        this.topic = topic;

        Post.create({
          title: "Flair testing takes a while",
          body: "Don't expect to get this done in five minutes",
          topicId: this.topic.id
        })
        .then(post => {
          this.post = post;

          Flair.create({
            name: "Truth teller",
            color: "blue",
            postId: this.post.id
          })
          .then(flair => {
            this.flair = flair;
            done();
          });
        });
      });
    });
  });
  /* Test to make sure the new flair form renders */
  describe("GET /posts/:postId/flairs/new", () => {
    it("should render a new flair form", done => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/new`, (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });
  });
  /* Test to make sure a flair is successfully created */
  describe("POST /posts/:postId/flairs/create", () => {
    it("should create a new flair and redirect", done => {
      const option = {
        url: `http://localhost:3000/posts/${this.post.id}/flairs/create`,
        form: {
          name: "Random flair",
          color: "pink"
        }
      };
      request.post(option, (error, response, body) => {
        Flair.findOne({where: {name: "Random flair"}})
        .then(flair => {
          expect(flair).not.toBeNull();
          expect(flair.name).toBe("Random flair");
          expect(flair.color).toBe("pink");
          expect(flair.postId).not.toBeNull();
          done();
        })
        .catch(error => {
          console.log(error);
          done();
        });
      })
    });
  });
  /* Test to show the selected flair */
  describe("GET /posts/:postId/flairs/:id", () => {
    it("should render a view with selected flair", done => {
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}`, (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("Truth teller");
        done();
      });
    });
  });
  /* Test to delete the selected flair */
  describe("POST /posts/:postId/flairs/:id/destroy", () => {
    it("should delete the flair with the associated ID", done => {
      /* Make sure the flair is in the database */
      expect(this.flair.id).toBe(1);

      request.post(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/destroy`, (error, response, body) => {
        /* Confirm that the flair was deleted when the destroy endpoint is visited */
        Flair.findById(1)
        .then(flair => {
          expect(error).toBeNull();
          expect(flair).toBeNull();
          done();
        })
      });
    });
  });
  describe("GET /posts/:postId/flairs/:id/edit", () => {
    it("should render a view with an edit flair form", done => {
      request.get(`${localhost}/posts/${this.post.id}/flairs/${this.flair.id}/edit`, (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("Edit Flair");
        expect(body).toContain("Truth teller");
        done();
      });
    });
  });
  describe("POST /posts/:postId/flairs/:id/update", () => {
    it("should return status code 302", done => {
      request.post({
        url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/update`,
        form: {
          name: "Truth teller",
          color: "blue"
        }
      }, (error, response, body) => {
        expect(response.statusCode).toBe(302);
        done();
      });
    });
    it("should update the flair with the given values", done => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/update`,
        form: {
          name: "Lie teller",
          color: "hot pink"
        }
      };
      request.post(options, (error, response, body) => {
        expect(error).toBeNull();

        Flair.findOne({
          where: {id: this.flair.id}
        })
        .then(flair => {
          expect(flair.name).toBe("Lie teller");
          done();
        });
      });
    });
  });
});

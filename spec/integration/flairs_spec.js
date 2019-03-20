const request = require("request");
const server = require("../../src/server");
const base = `http://localhost:3000/topics`;

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
        url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/create`,
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
      request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/:id`, (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("Truth teller");
        done();
      });
    });
  });
});

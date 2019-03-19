const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Post", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then(response => {
      /* Create a topic to be used in each test */
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
      .then(topic => {
        this.topic = topic;
        /* Create a post to be used in each test */
        Post.create({
          title: "My first visit to Proxima Centauri b",
          body: "I saw some rocks.",

          /* Associate post with the appropriate topic */
          topicId: this.topic.id
        })
        .then(post => {
          this.post = post;
          done();
        });
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
  });
  describe("#create()", () => {
    it("should create a post object with a title, body, and assigned topic", done => {
      Post.create({
        title: "Pros of Cryosleep during the long journey",
        body: "1. Not have to answer the 'are were there yet?' question.",
        /* Associate the post with the topic we created in beforeEach */
        topicId: this.topic.id
      })
      .then(post => {
        expect(post.title).toBe("Pros of Cryosleep during the long journey");
        expect(post.body).toBe("1. Not have to answer the 'are were there yet?' question.");
        done();
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
    it("should not create a post with missing title, body, or assigned topic", done => {
      Post.create({
        title: "Pros of Cyrosleep during the long journey"
      })
      .then(post => {
        done();
      })
      .catch(error => {
        expect(error.message).toContain("Post.body cannot be null");
        expect(error.message).toContain("Post.topicId cannot be null");
        done();
      });
    });
  });
  describe("#setTopic()", () => {
    it("should associate a topic and a post together", done => {
      Topic.create({
        title: "Challenege of interstellar travel",
        description: "1. The Wi-Fi is terrible"
      })
      .then(newTopic => {
        expect(this.post.topicId).toBe(this.topic.id);

        this.post.setTopic(newTopic)
        .then(post => {
          expect(post.topicId).toBe(newTopic.id);
          done();
        });
      });
    });
  });
  describe("#getTopic()", () => {
    it("should return the associated topic", done => {
      this.post.getTopic()
      .then(associatedTopic => {
        expect(associatedTopic.title).toBe("Expeditions to Alpha Centauri");
        done();
      });
    });
  });
});

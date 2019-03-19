const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

/* Test the create and getPosts methods for the topic model. */

describe("Topic", () => {
  beforeEach(done => {
    this.topic;
    this.post1;
    this.post2;

    sequelize.sync({force: true}).then(response => {
      Topic.create({
        title: "Favorite foods",
        description: "Tell me your favorite foods (unless it's bacon)",
      })
      .then(topic => {
        /* Associate this.topic with the topic just created */
        this.topic = topic;

        Post.create({
          title: "Bacon is great",
          body: "Dude, I'll tell you about bacon if I WANT to tell you about bacon",

          topicId: this.topic.id
        })
        .then(post => {
          this.post1 = post;
          done();
        });
        Post.create({
          title: "Am I allowed to like salads?",
          body: "I'm vegan, guys. I'm surrounded by meat eaters. Am I loved here?",

          topicId: this.topic.id
        }).then(post => {
          this.post2 = post;
          done();
        });
      })
      .catch(error => {
        console.log(error);
      });
    });
  });
  describe("#create()", () => {
    it("should successfully create a topic", done => {
      Topic.create({
        title: "Test topic",
        description: "This is a test"
      })
      .then(topic => {
        expect(topic.title).toBe("Test topic");
        expect(topic.description).toBe("This is a test");
        done();
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
  });
  describe("#getPosts()", () => {
    it("should successfully retrieve the posts associated with the topic", done => {
      this.topic.getPosts()
      .then(associatedPosts => {
        expect(associatedPosts[0].title).toBe("Bacon is great");
        expect(associatedPosts[0].body).toBe("Dude, I'll tell you about bacon if I WANT to tell you about bacon");

        expect(associatedPosts[1].title).toBe("Am I allowed to like salads?");
        expect(associatedPosts[1].body).toBe("I'm vegan, guys. I'm surrounded by meat eaters. Am I loved here?");
        done();
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
  });
});

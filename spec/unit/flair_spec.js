const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {
  /* Create a topic, post, and flair for the subsequent tests */
  beforeEach(done => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({force: true}).then(response => {
      Topic.create({
        title: "Favorite flairs",
        description: "What flairs do y'all, like? Discuss here."
      })
      .then(topic => {
        this.topic = topic;

        Post.create({
          title: "That red flair is tight",
          body: "I just love red so freaking much, you know?",
          topicId: this.topic.id
        })
        .then(post => {
          this.post = post;
          Flair.create({
            name: "Devil's advocate",
            color: "blue",
            postId: this.post.id
          })
          .then(flair => {
            this.flair = flair;
            done();
          })
        })
        .catch(error => {
          console.log(error);
          done();
        })
      });
    });
  });
  /* Testing the creation of a flair */
  describe("#create()", () => {
    it("should create a flair with a title, designated color, and assigned post", done => {
      Flair.create({
        name: "Conversation starter",
        color: "red",
        postId: this.post.id
      })
      .then(flair => {
        expect(flair.name).toBe("Conversation starter");
        expect(flair.color).toBe("red");
        done();
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
    it("should not create a post with missing title, body, or assigned post", done => {
      Flair.create({
        name: "Here's my name bro"
      })
      .then(flair => {
        done();
      })
      .catch(error => {
        expect(error.message).toContain("Flair.color cannot be null");
        expect(error.message).toContain("Flair.postId cannot be null");
        done();
      });
    });
  });
  /* Testing setPost() on a flair */
  describe("#setPost()", () => {
    it("should associate a flair and a post together", done => {
      Post.create({
        title: "here's a post title",
        body: "Here's my post body",
        topicId: this.topic.id
      })
      .then(newPost => {
        expect(this.flair.postId).toBe(this.post.id);

        this.flair.setPost(newPost)
        .then(flair => {
          expect(flair.postId).toBe(newPost.id);
          done();
        });
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
  });
  /* Testing getPost() on a flair */
  describe("#getTopic()", () => {
    it("should return the flair's associated post", done => {
      this.flair.getPost()
      .then(associatedPost => {
        expect(associatedPost.title).toBe("That red flair is tight");
        done();
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
  });
});

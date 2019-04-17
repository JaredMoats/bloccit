const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Comment = require("../../src/db/models").Comment;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
  beforeEach(done => {
    sequelize
      .sync({ force: true })
      .then(() => {
        done();
      })
      .catch(error => {
        console.log(error);
        done();
      });
  });
  describe("GET /users/sign_up", () => {
    it("should render a view with a sign up form", done => {
      request.get(`${base}sign_up`, (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });
  describe("POST /users", () => {
    it("should create a new user with valid values and redirect", done => {
      const options = {
        url: base,
        form: {
          email: "user@example.com",
          password: "1234567890"
        }
      };
      request.post(options, (error, response, body) => {
        User.findOne({ where: { email: "user@example.com" } })
          .then(user => {
            expect(user).not.toBeNull();
            expect(user.email).toBe("user@example.com");
            expect(user.id).toBe(1);
            done();
          })
          .catch(error => {
            console.log(error);
            done();
          });
      });
    });
    it("should not create a new user with invalid attributes and redirect", done => {
      request.post(
        {
          url: base,
          form: {
            email: "NO",
            password: "1234567890"
          }
        },
        (error, response, body) => {
          User.findOne({ where: { email: "NO" } })
            .then(user => {
              expect(user).toBeNull();
              done();
            })
            .catch(error => {
              console.log(error);
              done();
            });
        }
      );
    });
  });
  describe("GET /users/sign_in", () => {
    it("should render a view with a sign in form", done => {
      request.get(`${base}sign_in`, (error, response, body) => {
        expect(error).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });
  });
  describe("GET /users/:id", () => {
    beforeEach(done => {
      // #3
      this.user;
      this.post;
      this.comment;

      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      }).then(res => {
        this.user = res;

        Topic.create(
          {
            title: "Winter Games",
            description: "Post your Winter Games stories.",
            posts: [
              {
                title: "Snowball Fighting",
                body: "So much snow!",
                userId: this.user.id
              }
            ]
          },
          {
            include: {
              model: Post,
              as: "posts"
            }
          }
        ).then(res => {
          this.post = res.posts[0];

          Comment.create({
            body: "This comment is alright.",
            postId: this.post.id,
            userId: this.user.id
          }).then(res => {
            this.comment = res;
            done();
          });
        });
      });
    });

    // #4
    it("should present a list of comments and posts a user has created", done => {
      request.get(`${base}${this.user.id}`, (err, res, body) => {
        // #5
        expect(body).toContain("Snowball Fighting");
        expect(body).toContain("This comment is alright.");
        done();
      });
    });
  });
});

const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
  beforeEach(done => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch(error => {
      console.log(error);
      done();
    });
  });
  describe("#create()", () => {
    it("should create a User object with a valid email and password", done => {
      User.create({
        email: "user@example.com",
        password: "1234567890"
      })
      .then(user => {
        expect(user.email).toBe("user@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
    it("should not create a user with invalid email or password", done => {
      User.create({
        email: "It's-a me, Mario!",
        password: "1234567890"
      })
      .then(user => {
        /* Code here won't be evaluated since an error will skip it. We'll evaluate
        this code in the catch block */
        done();
      })
      .catch(error => {
        expect(error.message).toContain("Validation error: must be a valid email");
        done();
      });
    });
    it("should not create a user with an email already taken", done => {
      User.create({
        email: "user@example.com",
        password: "1234567890"
      })
      .then(user => {
        User.create({
          email: "user@example.com",
          password: "nananananananananananana BATMAN!"
        })
        .then(user => {
          /* code will be skipped like above due to error */
          done();
        })
        .catch(error => {
          expect(error.message).toContain("Validation error");
          done();
        });
        done();
      })
      .catch(error => {
        console.log(error);
        done();
      });
    });
  });
});

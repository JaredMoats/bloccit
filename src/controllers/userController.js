const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUp(request, response, next) {
    response.render("users/sign_up");
  },
  signInForm(request, response, next) {
    response.render("users/sign_in");
  },
  signIn(request, response, next) {
    passport.authenticate("local")(request, response, () => {
      if (!request.user) {
        request.flash("notice", "Sign in failed. Please try again.");
        response.redirect("/users/sign_in");
      } else {
        request.flash("notice", "You've successfully signed in!");
        response.redirect("/");
      }
    });
  },
  signOut(request, response, next) {
    request.logout();
    request.flash("notice", "You've successfully signed out!");
    response.redirect("/");
  },
  show(req, res, next) {
    userQueries.getUser(req.params.id, (err, result) => {
      if (err || result.user === undefined) {
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/show", { ...result });
      }
    });
  },
  create(request, response, next) {
    let newUser = {
      email: request.body.email,
      password: request.body.password,
      passwordConfirmation: request.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (error, user) => {
      if (error) {
        request.flash("error", error);
        response.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(request, response, () => {
          request.flash("notice", "You've successfully signed in!");
          response.redirect("/");
        });
      }
    });
  }
};

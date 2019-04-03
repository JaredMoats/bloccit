module.exports = {
  validatePosts(request, response, next) {
    if (request.method === "POST") {
      request
        .checkParams("topicId", "must be valid")
        .notEmpty()
        .isInt();
      request
        .checkBody("title", "must be at least 2 characters in length")
        .isLength({ min: 2 });
      request
        .checkBody("body", "must be at least 10 characters in length")
        .isLength({ min: 10 });
    }

    const errors = request.validationErrors();

    if (errors) {
      request.flash("error", errors);
      return response.redirect(303, request.headers.referer);
    } else {
      return next();
    }
  },
  validateTopics(request, response, next) {
    if (request.method === "POST") {
      request
        .checkBody("title", "must be at least 5 characters in length")
        .isLength({ min: 5 });
      request
        .checkBody("description", "must be at least 10 characters in length")
        .isLength({ min: 10 });
    }

    const errors = request.validationErrors();

    if (errors) {
      request.flash("error", errors);
      return response.redirect(303, request.headers.referer);
    } else {
      return next();
    }
  },
  validateUsers(request, response, next) {
    if (request.method === "POST") {
      request.checkBody("email", "must be valid").isEmail();
      request
        .checkBody("password", "must be at least 6 characters long")
        .isLength({ min: 6 });
      request
        .checkBody("passwordConfirmation", "must match password provided")
        .optional()
        .matches(request.body.password);
    }

    const errors = request.validationErrors();

    if (errors) {
      request.flash("error", errors);
      return response.redirect(request.headers.referer);
    } else {
      return next();
    }
  },
  validateComments(req, res, next) {
    if (req.method === "POST") {
      req.checkBody("body", "must not be empty").notEmpty();
    }

    const errors = req.validationErrors();

    if (errors) {
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  }
};

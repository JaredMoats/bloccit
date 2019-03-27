module.exports = {
  /*init() loads the defined routes and defines them
  on the Express object*/
  init(app) {
    const staticRoutes = require('../routes/static');
    const topicRoutes = require("../routes/topics");
    const postRoutes = require("../routes/posts");
    const advertisementRoutes = require("../routes/advertisements");
    const flairRoutes = require("../routes/flairs");
    const userRoutes = require("../routes/users");

    app.use(staticRoutes);
    app.use(topicRoutes);
    app.use(postRoutes);
    app.use(advertisementRoutes);
    app.use(flairRoutes);
    app.use(userRoutes);
  }
}

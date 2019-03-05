module.exports = {
  /*init() loads the defined routes and defines them
  on the Express object*/
  init(app) {
    const staticRoutes = require('../routes/static');
    const topicRoutes = require("../routes/topics");

    app.use(staticRoutes);
    app.use(topicRoutes);
  }
}

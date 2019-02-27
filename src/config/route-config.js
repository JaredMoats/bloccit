module.exports = {
  /*init() loads the defined routes and defines them
  on the Express object*/
  init(app) {
    const staticRoutes = require('../routes/static');
    app.use(staticRoutes);
  }
}

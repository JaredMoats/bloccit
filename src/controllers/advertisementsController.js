const advertisementQueries = require("../db/queries.advertisements.js");

module.exports = {
  index(request, response, next) {
    advertisementQueries.getAllAdvertisements((error, advertisements) => {
      if(error)
        response.redirect(500, "static/index");
      else
        response.render("advertisements/index", { advertisements });
    })
  }
}

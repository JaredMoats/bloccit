module.exports = {
  index(request, response, next) {
    response.render("static/index", {title: "Welcome to Bloccit"});
  }
}

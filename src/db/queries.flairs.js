const Flair = require("./models").Flair;
const Post = require("./models").Post;
const Topic = require("./models").Topic;

module.exports = {
  addFlair(newFlair, callback) {
    return Flair.create(newFlair)
    .then(flair => {
      callback(null, flair);
    })
    .catch(error => {
      callback(error);
    });
  },
  getFlair(id, callback) {
    return Flair.findById(id)
    .then(flair => {
      callback(null, flair);
    })
    .catch(error => {
      callback(error);
    });
  }
}

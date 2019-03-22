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
  },
  deleteFlair(id, callback){
    return Flair.destroy({
      where: { id }
    })
    .then(deletedRecordsCount => {
      callback(null, deletedRecordsCount)
    })
    .catch(error => {
      callback(error);
    });
  },
  updateFlair(id, updatedFlair, callback) {
    return Flair.findById(id)
    .then(flair => {
      if(!flair) {
        return callback("Flair not found");
      }

      flair.update(updatedFlair, {
        fields: Object.keys(updatedFlair)
      })
      .then(() => {
        callback(null, post);
      })
      .catch(error => {
        callback(error);
      });
    });
  }
}

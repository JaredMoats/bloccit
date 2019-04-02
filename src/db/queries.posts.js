const Post = require("./models").Post;
const Topic = require("./models").Topic;
const Flair = require("./models").Flair;
const Authorizer = require("../policies/post");

module.exports = {
  addPost(newPost, callback) {
    return Post.create(newPost)
    .then(post => {
      callback(null, post);
    })
    .catch(error => {
      callback(error);
    });
  },
  getPost(id, callback) {
    return Post.findById(id, {
      include: [{
        model: Flair,
        as: "flairs"
      }]
    })
    .then(post => {
      callback(null, post);
    })
    .catch(error => {
      callback(error);
    });
  },
  deletePost(request, callback) {
    return Post.findById(request.params.id)
    .then(post => {
      const authorized = new Authorizer(request.user, post).destroy();
      if(authorized) {
        post.destroy()
        .then(response => {
          callback(null, post);
        })
      } else {
        callback(401);
      }
    })
    .catch(error => {
      console.log(error);
    })
  },
  updatePost(id, updatedPost, callback) {
    return Post.findById(id)
    .then(post => {
      if(!post) {
        return callback("Post not found");
      }
      const authorized = new Authorizer(id.user, post).update();
      if(authorized) {
        post.update(updatedPost, {
          fields: Object.keys(updatedPost)
        })
        .then(() => {
          callback(null, post);
        })
        .catch(error => {
          callback(error);
        });
      } else {
        request.flash("notice", "You are not permitted to do that");
        callback("Forbidden");
      }
    });
  }
}

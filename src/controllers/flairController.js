const flairQueries = require("../db/queries.flairs.js");

module.exports = {
  new(request, response, next) {
    response.render("flairs/new", {
      topicId: request.params.topicId,
      postId: request.params.postId
    });
  },
  create(request, response, next) {
    let newFlair = {
      name: request.body.name,
      color: request.body.color,
      topicId: request.params.topicId,
      postId: request.params.postId
    };
    flairQueries.addFlair(newFlair, (error, flair) => {
      if(error) {
        response.redirect(500, "/flairs/new");
      } else {
        response.redirect(303, `/posts/${newFlair.postId}/flairs/${flair.id}`)
      }
    });
  },
  show(request, response, next) {
    flairQueries.getFlair(request.params.id, (error, flair) => {
      if(error || flair == null) {
        console.log(`request.params.id: ${request.params.id}`);
        console.log("Your flair error: " + error);
        console.log("log of flair object: " + flair);
        response.redirect(404, "/");
      } else {
        response.render("flairs/show", {
          flair,
          topicId: request.params.topicId,
          postId: request.params.postId
        });
      }
    })
  },
  destroy(request, response, next) {
    flairQueries.deleteFlair(request.params.id, (error, deletedRecordsCount) => {
      if(error) {
        response.redirect(500, `/posts/${request.params.postId}/flairs/${request.params.id}`);
      } else {
        response.redirect(303, `/posts/${request.params.postId}`)
      }
    });
  },
  edit(request, response, next) {
    flairQueries.getFlair(request.params.id, (error, flair) => {
      if(error || flair == null) {
        response.redirect(404, "/");
      } else {
        response.render("flairs/edit", { flair });
      }
    });
  },
  update(request, response, next) {
    flairQueries.updateFlair(request.params.id, request.body, (error, flair) => {
      if(error || flair == null) {
        response.redirect(404, `/posts/${request.params.postId}/flairs/${request.params.id}/edit`);
      } else {
        response.redirect(`/posts/${request.params.postId}/flairs/${request.params.id}`);
      }
    });
  }
}

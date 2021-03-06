const express = require("express");
const router = express.Router();

const flairController = require("../controllers/flairController");

router.get("/topics/:topicId/posts/:postId/flairs/new", flairController.new);
router.get("/topics/:topicId/posts/:postId/flairs/:id", flairController.show);
router.get("/posts/:postId/flairs/:id/edit", flairController.edit);
router.post("/posts/:postId/flairs/create", flairController.create);
router.post("/topics/:topicId/posts/:postId/flairs/:id/destroy", flairController.destroy);
router.post("/posts/:postId/flairs/:id/update", flairController.update);

module.exports = router;

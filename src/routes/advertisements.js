const express = require("express");
const router = express.Router();
const advertisementsController = require("../controllers/advertisementsController");

router.get("/advertisements", advertisementsController.index);

module.exports = router;

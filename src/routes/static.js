const express = require('express');
const router = express.Router();

router.get("/", (request, response, next) => {
  response.send("Welcome to Bloccit");
});

router.get("/marco", (request, response, next) => {
  response.send("polo");
});

module.exports = router;

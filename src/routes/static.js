const express = require('express');
const router = express.Router();

router.get("/", (request, response, next) => {
  response.send("Welcome to Bloccit");
});

module.exports = router;

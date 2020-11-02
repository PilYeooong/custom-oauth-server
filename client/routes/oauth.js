const express = require('express');

const router = express.Router();

router.get('/login', (req, res, next) => {
  res.redirect(`http://localhost:3000/v1/oauth?client_id=${process.env.OAUTH_CLIENT_ID}`);
});

router.post('/callback', (req, res, next) => {
  console.log(req.body);
});

module.exports = router;
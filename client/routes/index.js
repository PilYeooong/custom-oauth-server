const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  if(req.session.jwt){
    console.log(req.session.jwt);
  }
  return res.render('main', { user: req.user });
});

module.exports = router;
const express = require('express');
const { verifyToken } = require('../middlewares');

const router = express.Router();

// 토큰 검증 후 유저의 정보를 넘겨준다.
router.post('/', verifyToken, (req, res, next) => {
  return res.status(200).send(req.decoded);
});

module.exports = router;
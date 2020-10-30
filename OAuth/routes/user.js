const express = require('express');

const router = express.Router();

// 토큰 검증 후 유저의 정보를 넘겨준다.
router.get('/', (req, res, next) => {
  res.send('user api');
});

module.exports = router;
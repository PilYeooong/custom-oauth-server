const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(req.query.clientid);
  return res.render('oauth');
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});
    if(!user) {
      return next('존재하지 않는 유저입니다.');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
      return next('비밀번호가 틀립니다.');
    };
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
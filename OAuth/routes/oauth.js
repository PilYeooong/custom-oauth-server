const express = require('express');
const bcrypt = require('bcrypt');
const { User, Domain } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const client_id = req.query.client_id;
    const exDomain = await Domain.findOne({ where: { clientId: client_id }});
    if(!exDomain) {
      return next('등록되지 않은 도메인 혹은 유효하지 않은 클라이언트 키 입니다.')
    }
    return res.render('oauth', { client_id });
  } catch (err) {
    console.error(err);
    next(err);
  }
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
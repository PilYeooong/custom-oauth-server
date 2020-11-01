const express = require('express');
const jwt = require('jsonwebtoken');
const { Domain, User } = require('../models');

const userRouter = require('./user');
const oauthRouter = require('./oauth');

const router = express.Router();

router.post('/token', async (req, res, next) => {
  const { clientId } = req.body;

  try {
    const domain = await Domain.findOne({
      where: { clientId },
      include: [{ model: User, attributes: ['id', 'nickname', 'email'] }],
    });
    if(!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다.'
      });
    }
    const token = jwt.sign({
      id: domain.User.id,
      email: domain.User.email,
      nickname: domain.User.nickname
    }, process.env.JWT_SECRET, {
      expiresIn: '3m',
      issuer: 'pilyeong'
    });
    return res.status(200).json({
      code: 200,
      message: '토큰이 발급되었습니다.',
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: '서버 에러'
    })
  }
});

router.use('/user', userRouter);
router.use('/oauth', oauthRouter);

module.exports = router;

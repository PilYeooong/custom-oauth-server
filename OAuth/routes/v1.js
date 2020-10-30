const express = require('express');
const jwt = require('jsonwebtoken');
const { Domain, User } = require('../models');

const userRouter = require('./user');

const router = express.Router();

router.post('/token', async (req, res, next) => {
  const { clientSecret } = req.body;

  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: [{ model: User, attributes: ['id', 'nickname'] }],
    });
    if(!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다.'
      });
    }
    const token = jwt.sign({
      id: domain.User.id,
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

module.exports = router;

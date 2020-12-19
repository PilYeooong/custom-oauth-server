const jwt = require('jsonwebtoken');
const { Domain } = require('../models');

exports.verifyToken = async (req, res, next) => {
  try {
    const { client_id, client_secret } = req.body;
    const domain = await Domain.findOne({
      where: { clientId: client_id, clientSecret: client_secret },
    });
    req.decoded = jwt.verify(req.headers.authorization, domain.clientSecret);
    return next();
  } catch (err) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    });
  }
};

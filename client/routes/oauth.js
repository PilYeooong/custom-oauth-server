const express = require('express');
const { User } = require('../models');
const axios = require('axios');
const { token } = require('morgan');

const router = express.Router();

const tokenRequest = async (req) => {
  try {
    if (!req.session.jwt) {
      const tokenRequest = await axios.post('http://localhost:3000/v1/token', {
        client_id: process.env.OAUTH_CLIENT_ID,
      });
      req.session.jwt = tokenRequest.data.token;

      return tokenRequest.data.token;
    }
  } catch (error) {
    console.error(error);
    if (error.response.status === 419) {
      // 토큰 만료 시
      delete req.session.jwt;
      return tokenRequest(req);
    }
    return error.response;
  }
};

const requestLogin = async (req, res, user) => {
  req.login(user, async (loginError) => {
    if (loginError) {
      console.error(loginError);
      return next(loginError);
    }
    await tokenRequest(req);
    return res.redirect('/');
  });
}

router.get('/login', (req, res, next) => {
  res.redirect(
    `http://localhost:3000/v1/oauth?client_id=${process.env.OAUTH_CLIENT_ID}`
  );
});

router.get('/callback', async (req, res, next) => {
  const email = decodeURIComponent(req.query.email);
  const nickname = decodeURIComponent(req.query.nickname);

  const user = await User.findOne({ where: { email } });
  if (!user) {
    const newUser = await User.create({
      email,
      nickname,
      password: 'randomString',
      provider: 'oauth',
    });
    return requestLogin(req, res, newUser);
  }
  return requestLogin(req, res, user);
});

module.exports = router;

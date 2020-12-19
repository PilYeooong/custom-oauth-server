const express = require('express');
const { User } = require('../models');
const axios = require('axios');

const router = express.Router();

const OAuthRequest = (res) => {
  return res.redirect(
    `http://localhost:3000/v1/oauth?client_id=${process.env.OAUTH_CLIENT_ID}`
  );
};

// 이후에도 oauth 서버 자원 접근시, 토큰을 검증 혹은 재발급이 필요할 경우 재발급 받아 세션에 저장한다.
const tokenRequest = async (req, res) => {
  try {
    if (!req.session.jwt) {
      OAuthRequest(res);
    }
    return await axios.get('http://localhost:3000/v1/user', {
      headers: { Authorization: `${req.session.jwt}` },
    });
  } catch (error) {
    console.error(error);
    if (error.response.status === 419) {
      // 토큰 만료 시
      delete req.session.jwt;
      return tokenRequest(req, res);
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
    return res.redirect('/');
  });
};

router.get('/login', (req, res, next) => {
  return OAuthRequest(res);
});

router.get('/callback', async (req, res, next) => {
  try {
    const { code } = req.query;

    const {
      data: { token },
    } = await axios.post('http://localhost:3000/v1/token', {
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    });
    // 토큰을 받아 다시 oauth 서버로 토큰 검증 및 유저 정보를 요청한다.
    const result = await axios.post(
      'http://localhost:3000/v1/user',
      { 
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
      },
      { headers: { Authorization: `${token}` } }
    );
    const email = decodeURIComponent(result.data.email);
    const nickname = decodeURIComponent(result.data.nickname);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const newUser = await User.create({
        email,
        nickname,
        password: 'randomString',
        provider: 'oauth',
      });
      req.session.jwt = token;
      return requestLogin(req, res, newUser);
    }
    req.session.jwt = token;
    return requestLogin(req, res, user);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;

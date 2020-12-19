const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { Domain } = require('../models');
const { v4: uuidV4 } = require('uuid');

const router = express.Router();

router.post('/domain', async (req, res, next) => {
  try {
    if(!req.user) {
      return res.status(403).json({ message: '로그인이 필요합니다. '});
    }
    await Domain.create({
      UserId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientId: uuidV4(),
      clientSecret: uuidV4(),
      redirectURI: req.body.redirectURI
    });
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/join', async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nickname,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => { 
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      
      return res.redirect('/');
    });
  })(req, res, next); 
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

const express = require('express');
const { User,Domain } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: (req.user && req.user.id) || null },
      include: [{ model: Domain }]
    });
    res.render('main', { user, domains: user && user.Domains });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/join', (req, res, next) => {
  res.render('join');
});

module.exports = router;

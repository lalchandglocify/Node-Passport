const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Campaign = require('../models/Campaign');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async(req, res) =>
  res.render('dashboard', {
    user: req.user,campaign:await Campaign.find({})
  })
);

// Dashboard
router.get('/users', ensureAuthenticated, (req, res) =>
  res.render('users', {
    user: req.user
  })
);


module.exports = router;

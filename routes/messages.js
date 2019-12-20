const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Campaign = require('../models/Campaign');
const User = require('../models/User');


router.get('/', ensureAuthenticated, async(req, res) =>

  res.render('singleChat', {

    user: req.user,users:await User.find({_id: {$ne: req.user._id}})

  })
);



module.exports = router;

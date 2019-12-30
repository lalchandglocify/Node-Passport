const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Campaign = require('../models/Campaign');
const User = require('../models/User');

const Messages = require('../models/Message');
const Conversation = require('../models/Conversation');

router.get('/', ensureAuthenticated, async(req, res) =>{
var users = await User.find({_id: {$ne: req.user._id}});
  	
  	for (var i = 0; i < users.length; i++) {
  		
  		var conversation = await Conversation.find({ownerId:req.user._id,userId:users[i]._id});
  		if(conversation.length==0)
  		{

  		let conversationme = new Conversation({ ownerId:req.user._id,userId:users[i]._id , name:'single'});
        conversationme.save();

        let conversationto = new Conversation({ ownerId:users[i]._id,userId:req.user._id, name:'single'});
        conversationto.save();

  		}

  	}
  res.render('singleChat', {

    user: req.user,users:await Conversation.find({ownerId:req.user._id}).populate('userId')

  })
});



router.get('/get-all/:id', ensureAuthenticated, async(req, res) => {

var messages = await Messages.find({"conversationId":req.params.id}).populate('senderId');
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.json(messages);
})





module.exports = router;

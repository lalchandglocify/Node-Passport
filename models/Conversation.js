const mongoose = require('mongoose');

const Conversation = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  name: {
    type: String,
    required: false
  }
 
});

const Conversations = mongoose.model('Conversation', Conversation);

module.exports = Conversations;

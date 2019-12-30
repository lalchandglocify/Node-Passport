const mongoose = require('mongoose');

const Message = new mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Messages = mongoose.model('Message', Message);

module.exports = Messages;

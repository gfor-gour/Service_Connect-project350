const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: String, enum: ['user', 'bot'], required: true },
  buttons: [{ type: String }],
  timestamp: { type: Date, default: Date.now },
});

const Chatbot = mongoose.model('Chatbot', messageSchema);

module.exports = Chatbot;

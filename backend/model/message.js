const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  senderID: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  receiverID: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  content: { type: String }
})

module.exports = mongoose.model('Message', MessageSchema)

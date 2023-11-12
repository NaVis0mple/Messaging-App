const mongoose = require('mongoose')

const FriendshipSchema = new mongoose.Schema({
  userA: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userA references a User document
    ref: 'User', // Referencing the 'User' model
    required: true
  },
  userB: {
    type: mongoose.Schema.Types.ObjectId, // Assuming userB references a User document
    ref: 'User', // Referencing the 'User' model
    required: true
  }
})
FriendshipSchema.index({ userA: 1, userB: 1 }, { unique: true }) // make query quickly and make sure not duplicate
module.exports = mongoose.model('Friendship', FriendshipSchema)
// 6545122f3a089842d123a065
// 654a466108954428380759ac

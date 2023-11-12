const Message = require('../model/message')
const jwt = require('jsonwebtoken')
const multer = require('multer') // handle form
const upload = multer()
const { body, validationResult } = require('express-validator')
const User = require('../model/user')

exports.getMessage = [
  // use jwt verify to get jwt payload
  (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decode = jwt.verify(token, process.env.jwtSecret, function (err, decoded) {
      if (err) {
        res.status(401).json('jwt not pass')
      } else {
        req.decoded = decoded
        next()
      }
    })
  },
  async (req, res, next) => {
    try {
      const targetChatWithEmail = req.query.target
      const meEmail = req.decoded.email
      const messages = await Message.find()
        .populate('senderID', 'email')
        .populate('receiverID', 'email')
        .exec()
      const filterMessages = messages.map(value => {
        if (value.senderID.email === meEmail && value.receiverID.email === targetChatWithEmail) {
          return {
            sender: meEmail,
            receiver: targetChatWithEmail,
            timestamp: value.timestamp,
            message: value.content
          }
        } else if (value.senderID.email === targetChatWithEmail && value.receiverID.email === meEmail) {
          return {
            sender: targetChatWithEmail,
            receiver: meEmail,
            timestamp: value.timestamp,
            message: value.content
          }
        }
        return null
      })
      const filterMessagesRemoveNull = filterMessages.filter(messages => messages !== null)
      res.status(200).json(filterMessagesRemoveNull)
    } catch (error) {
      res.status(500).json('db error')
    }
  }
]

exports.postMessage = [
  upload.none(),
  body('message').trim().escape().notEmpty(),
  (req, res, next) => { // input validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      next()
    }
  },
  (req, res, next) => { // jwt verify
    const token = req.header('Authorization').replace('Bearer ', '')
    // console.log('from friendlist.js', token)
    const decode = jwt.verify(token, process.env.jwtSecret, function (err, decoded) {
      if (err) {
        res.status(401).json('jwt not pass')
      } else {
        req.decoded = decoded
        next()
      }
    })
  },
  async (req, res, next) => {
    try {
      const meEmail = req.decoded.email
      const chatTargetEmail = req.body.chatTarget
      const meEmail_id = await User.findOne({ email: meEmail }).exec()
      const chatTargetEmail_id = await User.findOne({ email: chatTargetEmail }).exec()
      const addMessage = await Message.create({
        senderID: meEmail_id,
        receiverID: chatTargetEmail_id,
        content: req.body.message,
        timestamp: Date.now()
      })
      res.status(201).json(addMessage)
    } catch (error) {
      res.status(500).json('db error')
    }
  }
]
//   async (req, res, next) => {
//     const message = new Message({
//       senderID: '654b7df572a523ef85400575',
//       receiverID: '654a466108954428380759ac',
//       content: 'testmes:3 to 2'
//     })
//     message.save()
//   },

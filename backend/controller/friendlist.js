const jwt = require('jsonwebtoken')
const cookie = require('js-cookie')
const Friendship = require('../model/friendship')
require('dotenv').config()
const multer = require('multer') // handle form
const upload = multer()
const { body, validationResult } = require('express-validator')
const User = require('../model/user')

exports.getFriendList = [
  (req, res, next) => { // use jwt verify to get jwt payload
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
  async (req, res, next) => { // db
    try {
      const email = req.decoded.email
      const userFriends = await Friendship.find()
        .populate('userA', 'email')
        .populate('userB', 'email')
        .exec()
      const filterEmail = userFriends.map(value => {
        if (value.userA.email === email) {
          return value.userB.email
        } else if (value.userB.email === email) {
          return value.userA.email
        }
        return null
      })
      const filteredEmails = filterEmail.filter(email => email !== null)
      res.status(200).json({ filteredEmails, me: email }) // use to show on chatlist
    } catch (error) {
      res.status(500).json('db error')
    }
  }
]

exports.postFriendList = [
  upload.none(),
  body('email').trim().escape().notEmpty().isEmail(),
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
      const email = req.decoded.email
      const addTargetEmail = req.body.email
      const email_id = await User.findOne({ email }).exec()
      const addTargetEmail_id = await User.findOne({ email: addTargetEmail }).exec()
      if (addTargetEmail === email) {
        res.status(400).json('do not add youself friendship')
      } else {
        if (!addTargetEmail_id) {
          res.status(404).json(`db not find ${addTargetEmail}`)
        } else {
          const friendshipCheck = await Friendship
            .findOne()
            .or([{ userA: email_id, userB: addTargetEmail_id }, { userB: email_id, userA: addTargetEmail_id }])
            .exec()
          if (friendshipCheck) {
            res.status(200).json('friendship already exist' + friendshipCheck)
          } else {
          // add new friendship
            const addFriendship = await Friendship.create({ userA: email_id, userB: addTargetEmail_id })
            res.status(201).json('Friendship created: ' + addFriendship)
          }
        }
      }
    } catch (error) {
      res.status(500).json('db error')
    }
  }

]

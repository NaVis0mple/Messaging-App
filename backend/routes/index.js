const express = require('express')
const router = express.Router()
const signupController = require('../controller/signup')
const loginController = require('../controller/login')
const friendlistController = require('../controller/friendlist')
const chatroomController = require('../controller/chatroom')
const passport = require('passport')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('/')
})

// no need to get , is handle at front end

router.post('/signup', signupController.signup_post)

router.post('/login', loginController.login_post)

router.get('/api/friendlist',
  passport.authenticate('jwt', { session: false }),
  friendlistController.getFriendList
)

router.post('/api/friendlist',
  passport.authenticate('jwt', { session: false }),
  friendlistController.postFriendList
)

// chatroom

router.get('/api/message',
  passport.authenticate('jwt', { session: false }),
  chatroomController.getMessage
)

router.post('/api/message',
  passport.authenticate('jwt', { session: false }),
  chatroomController.postMessage
)

module.exports = router

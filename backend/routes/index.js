const express = require('express')
const router = express.Router()
const signupController = require('../controller/signup')
const loginController = require('../controller/login')
const passport = require('passport')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('/')
})

// no need to get , is handle at front end

router.post('/signup', signupController.signup_post)

router.post('/login', loginController.login_post)

router.get(
  '/test',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ message: 'you can access /test route' })
  })

module.exports = router

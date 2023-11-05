const { body, validationResult } = require('express-validator')
const User = require('../model/user')
const bcrypt = require('bcryptjs')

// router.post('/signup', signup)
exports.signup_post = [ // need to add check email duplicate
  body('email').trim().escape().notEmpty().isEmail(),
  body('password').trim().escape().isLength({ min: 8 }).withMessage('password at least 8 chr'),
  body('passwordConfirm').trim().escape().custom((value, { req }) => {
    return value === req.body.password
  }).withMessage('password confirm wrong'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      next()
    }
  },
  async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error('error hashing password', err)
        res.end('error hashing password')
      } else {
        const newUser = new User({
          email: req.body.email,
          password: hashedPassword
        })
        try {
          await newUser.save()
          res.end('add user to db')
        } catch (error) {
          console.error('Error saving user to the database', error)
          res.end('Error saving user to the database')
        }
      }
    })
  }
]

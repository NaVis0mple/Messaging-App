const { body, validationResult } = require('express-validator')
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer') // handle form
const upload = multer()
require('dotenv').config()
// router.post /login
exports.login_post = [
  upload.none(),
  body('email').trim().escape().notEmpty().isEmail(),
  body('password').trim().escape().isLength({ min: 8 }).withMessage('password atleast 8'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      next()
    }
  },
  async (req, res) => {
    const { email, password } = req.body
    try {
      const DbUserLookUp = await User.findOne({ email }).exec()
      if (DbUserLookUp) {
        const compareBcryptPassword = await bcrypt.compare(password, DbUserLookUp.password)
        if (compareBcryptPassword) {
          const opts = {} // token generate
          opts.expiresIn = '10000'
          const secret = process.env.jwtSecret
          const token = jwt.sign({ email }, secret, opts)
          return res.status(200).json({
            message: 'Auth Passed', // need to store at frontend
            status: true,
            token
          })
        }
      }
      return res.status(401).json({ message: 'Auth Failed' })
    } catch (error) {
      console.error(error)
      res.status(500).end(error)
    }
  }
]

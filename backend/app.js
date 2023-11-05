const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('./model/user')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express()
// cors
app.use(cors())

// mongodb
main().catch(err => console.log(err))
async function main () {
  await mongoose.connect(process.env.mongodb)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// passport
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.jwtSecret
const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  console.log(jwt_payload)
  const dbuser = await User.findOne({ email: jwt_payload.email }).exec()
  if (dbuser) {
    return done(null, true)
  }
  return done(null, false)
})
passport.use(jwtStrategy)

// router
app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  console.log(err)
  res.end('error')
})

module.exports = app

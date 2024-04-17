const { error } = require('./logger')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')

const errorHandler = (err, req, res, next) => {
  error(err.name, err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error')
  ) {
    console.log('in username error')
    return res.status(400).json({ error: 'expected `username` to be unique' })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token missing or invalid' })
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(err)
}

function unknownEndpoint(req, res) {
  res.status(400).json({ error: 'unknown endpoint' })
}

function tokenExtractor(req, res, next) {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  }
  next()
}

async function userExtractor(req, res, next) {
  let user = null
  try {
    user = jwt.verify(req.token, process.env.SECRET)
    req.user = await User.findById(user.id)
  } catch (error) {
    next(error)
  }
  next()
}

async function blogExtractor(req, res, next) {
  try {
    req.blog = await Blog.findById(req.params.id)
  } catch (error) {
    next(error)
  }
  next()
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  blogExtractor,
}

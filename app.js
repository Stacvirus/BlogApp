const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const { MONGODB_URI } = require('./utils/config')
const { info, error } = require('./utils/logger')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const commentsRouter = require('./controllers/comments')

const {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
} = require('./utils/middleware')

app.use(express.static('dist'))

mongoose
  .connect(MONGODB_URI)
  .then(() => info('connected to mongoDB'))
  .catch((err) => error(err.message))

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs/comments', commentsRouter)

if (process.env.NODE_ENV === 'test') {
  const testRouter = require('./controllers/testing')
  app.use('/api/testing', testRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)
module.exports = app

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const user = await User.findById(id).populate('blogs', {
      title: 1,
      important: 1,
      id: 1,
    })
    res.json(user)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body
  if (password.length < 3)
    return response.status(400).json({ error: 'min password length is 3' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter

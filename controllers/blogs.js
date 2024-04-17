const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (req, res, next) => {
  try {
    const results = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    })
    res.json(results)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id

  try {
    const blog = await Blog.findById(id).populate('user', {
      username: 1,
      name: 1,
    })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    blog.user.toString() === req.user.id.toString() &&
      (await Blog.findByIdAndDelete(req.params.id))
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', userExtractor, async (req, res, next) => {
  const body = req.body

  if (!body.title) return res.status(400).json({ error: 'title missing' })
  if (!body.likes) body.likes = 0

  const user = req.user
  body.user = user.id

  const blog = new Blog(body)

  try {
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  const body = req.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
      new: true,
    })
    res.json(updatedBlog).status(200)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter

const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')
const { blogExtractor } = require('../utils/middleware')

commentsRouter.post('/:id', blogExtractor, async (req, res, next) => {
  const { content } = req.body

  // if (!content) return res.status(400).json({ error: 'content missing' })

  const blog = req.blog

  const comment = new Comment({
    content,
    source: blog.id,
  })

  try {
    const savedCmt = await comment.save()
    res.status(201).json(savedCmt)

    blog.comments = blog.comments.concat(savedCmt.id)
    await blog.save()
  } catch (error) {
    next(error)
  }
})

commentsRouter.get('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const blog = await Blog.findById(id).populate('comments', {
      content: 1,
    })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

module.exports = commentsRouter

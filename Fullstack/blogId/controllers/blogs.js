// server written with async await (passes blog_api.test.js). No need for express-async-errors or catch in express5

const blogRouter = require('express').Router() // path is passed on when use() in app.js
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user')
    // .populate('user', { username: 1, name: 1})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  // logger.info('--controllers/blogs.js: request.params.id: ', request.params.id)
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  logger.info('--controllers/blogs.js: body: ', body)

  const user = request.user

  if (!Object.hasOwn(body, 'title') || !Object.hasOwn(body, 'url')) {
    response.statusMessage = 'title or url missing'
    return response.status(400).end()
  } else if (!Object.hasOwn(body, 'likes') ) {
    body.likes = 0
  }

  const blogToCreate = new Blog(body)
  blogToCreate.user = user._id

  const createdBlog = await blogToCreate.save()

  user.blogs = user.blogs.concat(createdBlog._id)
  await user.save()

  response.status(201).json(createdBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  // logger.info('--controllers/blogs.js: id: ', request.params.id)
  const blogToDelete = await Blog.findById(request.params.id)
  // logger.info('blogToDelete', blogToDelete)

  if (!blogToDelete) { // no blog was found with this (valid but non existing) id
    return response.status(410).end() // gone
  } 

  const user = request.user

  if (blogToDelete.user.toString() !== user._id.toString()) {
    // logger.info('--controllers/blogs.js: id of the logged in user and id of the blog creator do not match')
    return response.status(401).json({ error: 'only blog creator can delete blog' })
  }

  // await Blog.deleteOne( { _id: blogToDelete._id })
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  // logger.info('--controllers/blogs.js: body: ', body)
  if (!Object.hasOwn(body, 'likes')) {
    response.statusMessage = 'likes missing'
    return response.status(400).end()
  }

  const blogToUpdate = await Blog.findById(request.params.id)
  // logger.info('--controllers/blogs.js: blogToUpdate: ', blogToUpdate)
  if (!blogToUpdate) {
    return response.status(410).end() // gone
  }

  blogToUpdate.likes = body.likes
  const updatedBlog = await blogToUpdate.save()
  response.json(updatedBlog)
})


module.exports = blogRouter

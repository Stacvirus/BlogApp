const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)
const url = '/api/blogs'
const loginUri = '/api/login'
let token = null

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.blogs)

        const userLogin = { username: 'root', password: 'password' }
        const userLoged = await api.post(loginUri).send(userLogin)
        token = userLoged._body.token
    })

    test('blogs are returned as json', async () => {
        await api.get(url)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
        const res = await api.get(url)
        assert.strictEqual(res.body.length, helper.blogs.length)
    })

    describe('viewing a specific blog', () => {
        test('a specific blog can be viewed', async () => {
            const start = await helper.blogsInDb()
            const blogToView = start[1]

            const res = await api.get(`${url}/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(res.body, blogToView)
        })
    })

    describe('addition of new blog', () => {
        test('a valid blog can be added', async () => {
            const newblog = {
                title: 'async/await simplifies making async calls',
                author: 'stac virus',
                url: 'fullstackopen.org',
                likes: 2947
            }
            await api.post(url).set('Authorization', `Bearer ${token}`)
                .send(newblog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            const res = await api.get(url)
            const titles = res.body.map(r => r.title)
            assert.strictEqual(res.body.length, helper.blogs.length + 1)

            assert(titles.includes('async/await simplifies making async calls'))

        })

        test('blog without title is not added', async () => {
            const newblog = {
                author: 'stac virus',
                url: 'wanda.com',
                likes: 5
            }

            await api.post(url).set('Authorization', `Bearer ${token}`)
                .send(newblog)
                .expect(400)
            const res = await api.get(url)
            assert.strictEqual(res.body.length, helper.blogs.length)
        })

        test('if likes are obmitted then is zero', async () => {
            const newblog = {
                title: 'async/await simplifies making async calls',
                author: 'stac virus',
                url: 'fullstackopen.org',
            }

            const res = await api.post(url).set('Authorization', `Bearer ${token}`)
                .send(newblog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(res.body.likes, 0)
        })
    })

    describe('deletion of blog', () => {
        test('a blog can be deleted', async () => {
            const newblog = {
                title: 'async/await simplifies making async calls',
                author: 'stac virus',
                url: 'fullstackopen.org',
                likes: 2947
            }
            await api.post(url).set('Authorization', `Bearer ${token}`)
                .send(newblog)

            const start = await helper.blogsInDb()
            const blogToDelete = start[start.length - 1]

            await api.delete(`${url}/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const end = await helper.blogsInDb()
            const titles = end.map(r => r.title)
            assert(!titles.includes(blogToDelete.title))
            assert.strictEqual(end.length, start.length - 1)
        })
    })

    describe('update the content of a blog', () => {
        test('update the likes of a blog', async () => {
            const start = await helper.blogsInDb()
            const newblog = {
                title: start[0].title,
                url: start[0].url,
                likes: 458
            }

            await api.put(`${url}/${start[0].id}`).send(newblog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const res = await api.get(url)
            const likes = res.body.map(r => r.likes)

            assert(likes.includes(newblog.likes))
        })
    })

    describe('token based verification', () => {
        test('if token omitted status 401', async () => {
            const newBlog = helper.blogs[0]

            await api.post(url).send(newBlog)
                .expect(401)
        });
    })
})



after(async () => {
    await mongoose.connection.close()
})
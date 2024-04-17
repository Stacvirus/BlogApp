const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

describe('first tests', () => {

    test('dummy returns one', () => {
        const res = listHelper.dummy(blogs)
        assert.strictEqual(res, 1)
    })


})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const res = listHelper.totalLikes([])
        assert.strictEqual(res, 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const res = listHelper.totalLikes(blogs[1])
        assert.strictEqual(res, 5)
    })

    test('total likes test', () => {
        const res = listHelper.totalLikes(blogs)
        assert.strictEqual(res, 36)
    })
})

describe('find favorite blog operations', () => {
    test('find favorite blog', () => {
        const res = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(res, blogs[2])
    })
})

describe('finding the favorite author', () => {
    test('favorite author', () => {
        const ans = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(ans, { author: "Robert C. Martin", blogs: 3 })
    })
})

describe('finding the total likes of the author with favorite blog', () => {
    test('total likes of favorite author', () => {
        const ans = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(ans, { author: "Edsger W. Dijkstra", likes: 17 })
    })
})
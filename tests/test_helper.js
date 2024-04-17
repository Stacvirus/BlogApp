const Blog = require('../models/blog')
const User = require('../models/user')

const blogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },

]

async function blogsInDb() {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

async function usersInDb() {
    const users = await User.find({})
    return users.map(b => b.toJSON())
}

module.exports = { blogs, blogsInDb, usersInDb }
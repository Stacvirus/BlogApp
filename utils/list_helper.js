const { map, kebabCase } = require("lodash")

function dummy(blogs) {
    return 1
}

function totalLikes(blogs) {
    let total = null
    if (blogs.length > 1) total = blogs.reduce((a, c) => a + c.likes, 0)
    else if (blogs.length == 0) total = 0
    else total = blogs.likes
    // console.log(total)
    return total
}

function favoriteBlog(blogs) {
    let maxLikes = 0
    const ans = blogs.filter(blog => blog.likes > maxLikes ? maxLikes = blog.likes : false)
    return ans[ans.length - 1]
}

function mostBlogs(blogs) {
    const authors = blogs.map(b => b.author)

    const mapAuthors = authors.reduce((author, num) => {
        author[num] = (author[num] || 0) + 1
        return author
    }, {})

    let max = 0
    for (key in mapAuthors) {
        if (mapAuthors[key] > max) max = mapAuthors[key]
    }

    let object = null
    for (key in mapAuthors) {
        if (mapAuthors[key] === max) {
            object = {
                author: key,
                blogs: max
            }
        }
    }
    return object
}

function mostLikes(blogs) {
    let maxLikes = 0
    const blogger = blogs.filter(b => {
        if (b.likes > maxLikes) {
            maxLikes = b.likes
            return b
        }
    })
    const author = blogger[blogger.length - 1].author
    const authorsArray = blogs.filter(b => b.author === author ? b : false)
    // console.log(authorsArray)
    const totalLikes = authorsArray.reduce((acc, curr) => acc + curr.likes, 0)
    return { author: author, likes: totalLikes }

}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
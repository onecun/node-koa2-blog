module.exports = {
    post: process.env.PORT || 4567,
    session: {
        key: 'blog',
        maxAge: '86400000',
    },
    mongodb: 'mongodb://localhost:27017/blog'
}